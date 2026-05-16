"use client";

import { LIVE_SERVER_URL } from "@/shared/constants/clientEnv";
import { api } from "@/shared/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./viewer.scss";
type ChatMessage = {
    name: string;
    message: string;
};

export default function Broadcast() {
    const params = useParams();
    const router = useRouter();
    const roomId =
        params.roomId as string;

    const searchParams =
        useSearchParams();

    const productId =
        searchParams.get("productId");

    const thumbnail =
        searchParams.get("thumbnail");

    const title =
        searchParams.get("title");

    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const [input, setInput] =
        useState("");

    const token =
        useAuthStore(
            state => state.accessToken
        );

    const hasHydrated =
        useAuthStore(
            state => state._hasHydrated
        );

    const socketRef =
        useRef<Socket | null>(null);

    const peerRef =
        useRef<RTCPeerConnection | null>(null);

    const videoRef =
        useRef<HTMLVideoElement | null>(null);

    const [chats, setChats] =
        useState<any[]>([]);

    const [message, setMessage] =
        useState("");

    const startedRef =
        useRef(false);
    const endedRef =
        useRef(false);
    const sendChat =
        () => {

            if (!message.trim()) return;

            socketRef.current?.emit(
                "chat",
                {
                    roomId,
                    message
                }
            );

            setMessage("");

        };

    const endBroadcast =
        async () => {
            if (endedRef.current)
                return;

            endedRef.current = true;

            try {

                // viewer들에게 방송 종료 알림
                socketRef.current?.emit(
                    "broadcast_end",
                    roomId
                );

                // DB 방송 삭제
                await api.delete(
                    `${LIVE_SERVER_URL}/live/${roomId}`
                );

            } catch (err) {

                console.log(err);

            } finally {

                // socket 종료
                socketRef.current?.disconnect();

                // WebRTC 종료
                peerRef.current?.close();

                // 홈 이동
                // router.push("/");

            }

        };
    // =========================
    // offer 생성 함수
    // =========================
    const createOffer =
        async () => {

            if (!peerRef.current) return;

            const offer =
                await peerRef.current.createOffer();

            await peerRef.current.setLocalDescription(
                offer
            );

            console.log(
                "offer 생성"
            );

            socketRef.current?.emit(
                "offer",
                {
                    roomId,
                    offer
                }
            );

        };

    // =========================
    // WebRTC 시작
    // =========================
    const startMedia =
        async () => {

            try {

                const stream =
                    await navigator
                        .mediaDevices
                        .getUserMedia({
                            video: true,
                            audio: true
                        });

                if (videoRef.current) {

                    videoRef.current.srcObject =
                        stream;

                }

                peerRef.current =
                    new RTCPeerConnection({
                        iceServers: [
                            {
                                urls:
                                    "stun:stun.l.google.com:19302"
                            },
                            {
                                urls:
                                    "turn:candy-api.duckdns.org:3478",
                                username:
                                    "test",
                                credential:
                                    "1234"
                            }
                        ]
                    });
                // stream 등록
                stream
                    .getTracks()
                    .forEach(track => {

                        peerRef.current?.addTrack(
                            track,
                            stream
                        );

                    });

                // answer 수신
                socketRef.current?.on(
                    "answer",
                    async (answer) => {

                        console.log(
                            "answer 수신"
                        );

                        await peerRef.current?.setRemoteDescription(
                            new RTCSessionDescription(
                                answer
                            )
                        );

                    }
                );

                // ICE 수신
                socketRef.current?.on(
                    "ice-candidate",
                    async (candidate) => {

                        console.log(
                            "ICE 수신"
                        );



                        await peerRef.current.addIceCandidate(
                            new RTCIceCandidate(
                                candidate
                            )
                        );



                    }
                );

                // ICE 생성
                peerRef.current.onicecandidate =
                    (event) => {

                        if (event.candidate) {
                            console.log(
                                "gathering:",
                                peerRef.current?.iceGatheringState
                            );
                            console.log(
                                "ICE 생성"
                            );

                            socketRef.current?.emit(
                                "ice-candidate",
                                {
                                    roomId,
                                    candidate:
                                        event.candidate
                                }
                            );

                        }

                    };


                peerRef.current.onicecandidateerror =
                    (err) => {

                        console.log("ICE ERROR");

                        console.log(
                            "url:",
                            err.url
                        );

                        console.log(
                            "errorCode:",
                            err.errorCode
                        );

                        console.log(
                            "errorText:",
                            err.errorText
                        );

                    };

            } catch (err) {

                console.log(err);

            }

        };

    // =========================
    // socket 연결
    // =========================
    const connectSocket =
        (token: string) => {

            socketRef.current = io(
                LIVE_SERVER_URL,
                {
                    path: "/live/socket.io",

                    auth: {
                        token
                    }
                }
            );

            socketRef.current.on(
                "connect",
                async () => {

                    console.log(
                        "broadcast socket connect"
                    );

                    // 먼저 media 생성
                    await startMedia();


                    // 그 다음 room 입장
                    socketRef.current?.emit(
                        "join_room",
                        roomId
                    );

                }
            );

            socketRef.current?.on(
                "chat",
                (chatData) => {

                    console.log(
                        "채팅 수신"
                    );

                    console.log(chatData);

                    setChats(prev => [
                        ...prev,
                        chatData
                    ]);

                }
            );

            // viewer 입장 감지
            socketRef.current.on(
                "viewer_joined",
                async () => {

                    console.log(
                        "viewer 입장"
                    );

                    await createOffer();

                }
            );

            // 채팅 수신
            socketRef.current.on(
                "chat",
                (data: ChatMessage) => {

                    setMessages(prev => [
                        ...prev,
                        data
                    ]);

                }
            );

        };

    // =========================
    // 최초 실행
    // =========================
    useEffect(() => {

        if (!hasHydrated) return;

        if (!token) return;

        const fetchChats =
            async () => {

                try {

                    const response =
                        await fetch(
                            `${LIVE_SERVER_URL}/live/chat/${roomId}`
                        );

                    const data =
                        await response.json();

                    console.log(data);

                    setChats(data);

                } catch (err) {

                    console.log(err);

                }

            };

        const handleStartLive =
            async () => {

                if (startedRef.current)
                    return;
                startedRef.current = true;
                await api.post(
                    `${LIVE_SERVER_URL}/live/start`,
                    {
                        roomId,

                        productId:
                            Number(productId),

                        title:
                            title || "라이브 방송",

                        thumbnail
                    }
                );
            }


        handleStartLive();

        fetchChats();

        connectSocket(token);

        return () => {
            endBroadcast();
            socketRef.current?.disconnect();

            peerRef.current?.close();

        };

    }, [
        hasHydrated,
        token
    ]);

    // =========================
    // 채팅 전송
    // =========================
    const sendMessage = () => {

        if (!input.trim()) return;

        socketRef.current?.emit(
            "chat",
            {
                roomId,
                message: input
            }
        );

        setInput("");

    };

    return (

        // <div>

        //     <h1>
        //         broadcaster
        //     </h1>

        //     <video
        //         ref={videoRef}
        //         autoPlay
        //         playsInline
        //         muted
        //         style={{
        //             width: "500px",
        //             height: "300px",
        //             backgroundColor: "black"
        //         }}
        //     />

        //     <button
        //         onClick={createOffer}
        //     >
        //         offer 재전송
        //     </button>

        //     <button
        //         onClick={endBroadcast}
        //     >
        //         방송 종료
        //     </button>
        //     <div
        //         style={{
        //             width: "500px",
        //             marginTop: "20px"
        //         }}
        //     >

        //         <div
        //             style={{
        //                 height: "200px",
        //                 overflowY: "scroll",
        //                 border: "1px solid gray",
        //                 padding: "10px"
        //             }}
        //         >

        //             {
        //                 chats.map(
        //                     (chat, index) => (

        //                         <div key={index}>

        //                             <strong>
        //                                 {chat.name}
        //                             </strong>

        //                             : {chat.message}

        //                         </div>

        //                     )
        //                 )
        //             }

        //         </div>

        //         <div
        //             style={{
        //                 display: "flex",
        //                 marginTop: "10px",
        //                 gap: "10px"
        //             }}
        //         >

        //             <input
        //                 value={message}
        //                 onChange={(e) =>
        //                     setMessage(
        //                         e.target.value
        //                     )
        //                 }
        //                 placeholder="채팅 입력"
        //                 style={{
        //                     flex: 1
        //                 }}
        //             />

        //             <button
        //                 onClick={sendChat}
        //             >
        //                 전송
        //             </button>

        //         </div>

        //     </div>

        // </div>

        <div className="viewer-page">

            <div className="viewer-layout">

                {/* 왼쪽 방송 영역 */}
                <div className="video-section">

                    <div className="video-container">

                        <div className="live-badge">
                            LIVE
                        </div>

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                        />

                    </div>

                    <div className="live-info">

                        <div className="stream-title">
                            {title || "라이브 방송"}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px"
                            }}
                        >

                            <button
                                className="chat-button"
                                onClick={createOffer}
                            >
                                재연결
                            </button>

                            <button
                                className="chat-button"
                                onClick={endBroadcast}
                                style={{
                                    background: "#ff2a2a"
                                }}
                            >
                                방송 종료
                            </button>

                        </div>

                    </div>

                </div>

                {/* 오른쪽 채팅 */}
                <div className="chat-section">

                    <div className="chat-header">
                        실시간 채팅
                    </div>

                    <div className="chat-list">

                        {
                            chats.map(
                                (chat, index) => (

                                    <div
                                        key={index}
                                        className="chat-item"
                                    >

                                        <span className="chat-name">
                                            {chat.name}
                                        </span>

                                        {chat.message}

                                    </div>

                                )
                            )
                        }

                    </div>

                    <div className="chat-input-wrap">

                        <input
                            className="chat-input"
                            value={message}
                            onChange={(e) =>
                                setMessage(
                                    e.target.value
                                )
                            }
                            placeholder="메시지 보내기!"
                        />

                        <button
                            className="chat-button"
                            onClick={sendChat}
                        >
                            전송
                        </button>

                    </div>

                </div>

            </div>

        </div>


    );

}