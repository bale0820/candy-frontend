// "use client"

// import { api } from "@/shared/lib/axios";
// import { useAuthStore } from "@/store/authStore";
// import { useEffect, useRef, useState } from "react";
// import { io, Socket } from "socket.io-client";

// type ChatMessage = {
//     name: string;
//     message: string;
// };

// export default function Broadcast() {

//     const [messages, setMessages] = useState<ChatMessage[]>([]);
//      const setAccessToken = useAuthStore.getState().setAccessToken;
//     const [input, setInput] = useState("");
//     const isRefreshing = useRef(false);
//     // socket 저장
//     const socketRef = useRef<Socket | null>(null);
//     const videoRef =
//         useRef<HTMLVideoElement | null>(null);
//     const peerRef =
//         useRef<RTCPeerConnection | null>(null);
//     const roomId = "live-1";

//     useEffect(() => {

//         const getChats = async () => {

//             const res = await api.get(
//                 `http://192.168.219.137:8081/chat/${roomId}`
//             );

//             setMessages(res.data);

//         };

//         const token =
//             useAuthStore.getState().accessToken;

//         // socket 연결
//         socketRef.current = io(
//             process.env.NEXT_PUBLIC_SOCKET_URL!,
//             {
//                 auth: {
//                     token
//                 }
//             }
//         );

//         socketRef.current.on(
//             "connect_error",
//             async (err: any) => {

//                 if (
//                     err.data?.status === 401 &&
//                     !isRefreshing.current
//                 ) {

//                     isRefreshing.current = true;

//                     try {

//                         const res = await api.post(
//                             "/auth/refresh",
//                             {},
//                             { withCredentials: true }
//                         );

//                         const newAccessToken =
//                             res.data.accessToken;

//                         setAccessToken(newAccessToken);

//                         socketRef.current?.disconnect();

//                         socketRef.current = io(
//                             process.env.NEXT_PUBLIC_SOCKET_URL!,
//                             {
//                                 auth: {
//                                     token: newAccessToken
//                                 },

//                                 reconnection: false
//                             }
//                         );

//                     } catch (err) {

//                         console.log("refresh 실패");

//                     } finally {

//                         isRefreshing.current = false;

//                     }

//                 }

//             }
//         );

//         getChats();

//         // room 입장
//         socketRef.current.emit(
//             "join_room",
//             roomId
//         );

//         // 채팅 수신
//         socketRef.current.on(
//             "chat",
//             (data: ChatMessage) => {

//                 setMessages(prev => [
//                     ...prev,
//                     data
//                 ]);

//             }
//         );

//         return () => {

//             socketRef.current?.off("chat");

//             socketRef.current?.disconnect();

//         };

//     }, []);


//     useEffect(() => {

//         const startMedia = async () => {

//             try {
//                 console.log("start");
//                 // 카메라 + 마이크
//                 const stream =
//                     await navigator.mediaDevices.getUserMedia({
//                         video: true,
//                         audio: true
//                     });
//                 console.log(stream);
//                 // 내 화면 출력
//                 if (videoRef.current) {

//                     videoRef.current.srcObject =
//                         stream;

//                 }

//                 // PeerConnection 생성
//                 peerRef.current =
//                     new RTCPeerConnection();

//                 // stream 추가
//                 stream.getTracks().forEach(track => {

//                     peerRef.current?.addTrack(
//                         track,
//                         stream
//                     );

//                 });

//                 // offer 생성
//                 const offer =
//                     await peerRef.current?.createOffer();

//                 // 내 브라우저 저장
//                 await peerRef.current?.setLocalDescription(
//                     offer
//                 );

//                 console.log(offer);

//             } catch (err) {

//                 console.log(err);

//             }

//         };

//         startMedia();

//     }, []);

//     const sendMessage = () => {

//         if (!input.trim()) return;
//         console.log(input);
//         socketRef.current?.emit("chat", {

//             roomId,

//             message: input

//         });

//         setInput("");

//     };

//     return (
//         <div>
//             <div>

//                 <h1>live broadcast</h1>

//                 <video
//                     ref={videoRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     style={{
//                         width: "500px"
//                     }}
//                 />

//             </div>
//             <h1>{roomId}</h1>

//             <div>
//                 {messages.map((msg, i) => (

//                     <div key={i}>
//                         <strong>{msg.name}</strong>
//                         : {msg.message}
//                     </div>

//                 ))}
//             </div>

//             <input
//                 value={input}
//                 onChange={(e) =>
//                     setInput(e.target.value)
//                 }
//             />

//             <button onClick={sendMessage}>
//                 send
//             </button>

//         </div>
//     );
// }

"use client";

import { LIVE_SERVER_URL } from "@/shared/constants/clientEnv";
import { api } from "@/shared/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type ChatMessage = {
    name: string;
    message: string;
};

export default function Broadcast() {

    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const [input, setInput] =
        useState("");

    // =========================
    // Zustand
    // =========================
    const token =
        useAuthStore(
            state => state.accessToken
        );

    const setAccessToken =
        useAuthStore(
            state => state.setAccessToken
        );

    const hasHydrated =
        useAuthStore(
            state => state._hasHydrated
        );

    // =========================
    // Ref
    // =========================
    const socketRef =
        useRef<Socket | null>(null);

    const peerRef =
        useRef<RTCPeerConnection | null>(null);

    const videoRef =
        useRef<HTMLVideoElement | null>(null);

    const isRefreshing =
        useRef(false);

    const roomId = "live-1";

    // =========================
    // WebRTC 시작
    // =========================
    const startMedia =
        async () => {

            try {

                console.log(
                    "WebRTC 시작"
                );

                // 카메라 + 마이크
                const stream =
                    await navigator
                        .mediaDevices
                        .getUserMedia({
                            video: true,
                            audio: true
                        });

                // 내 화면 출력
                if (videoRef.current) {

                    videoRef.current.srcObject =
                        stream;

                }

                // Peer 생성
                peerRef.current =
                    new RTCPeerConnection({
                        iceServers: [
                            {
                                urls: [
                                    "stun:stun.l.google.com:19302"
                                ]
                            }
                        ]
                    })

                // answer 수신
                socketRef.current?.on(
                    "answer",
                    async (answer) => {

                        console.log(
                            "answer 수신"
                        );

                        await peerRef.current?.setRemoteDescription(
                            answer
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

                        await peerRef.current?.addIceCandidate(
                            candidate
                        );

                    }
                );

                // 상대에게 stream 전달
                stream
                    .getTracks()
                    .forEach(track => {

                        peerRef.current?.addTrack(
                            track,
                            stream
                        );

                    });

                // ICE 생성 시 전송
                peerRef.current.onicecandidate =
                    (event) => {

                        if (event.candidate) {

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

                // offer 생성
                const offer =
                    await peerRef.current?.createOffer();

                // 내 브라우저 저장
                await peerRef.current?.setLocalDescription(
                    offer
                );

                console.log(
                    "offer 생성"
                );

                // offer 전송
                socketRef.current?.emit(
                    "offer",
                    {
                        roomId,
                        offer
                    }
                );

            } catch (err) {

                console.log(err);

            }

        };

    // =========================
    // socket 연결
    // =========================
    const connectSocket = (
        token: string
    ) => {

        socketRef.current?.disconnect();

        const socket = io(
            LIVE_SERVER_URL,
            {
                path: "/live/socket.io",

                auth: {
                    token
                },

                reconnection: false
            }
        );

        socketRef.current = socket;

        // 연결 성공
        socket.on(
            "connect",
            async () => {

                console.log(
                    "socket 연결 성공"
                );

                // room 입장
                socket.emit(
                    "join_room",
                    roomId
                );

                // socket 연결 후 WebRTC 시작
                await startMedia();

            }
        );

        // 채팅 수신
        socket.on(
            "chat",
            (data: ChatMessage) => {

                setMessages(prev => [
                    ...prev,
                    data
                ]);

            }
        );

        // socket 인증 실패
        socket.on(
            "connect_error",
            async (err: any) => {

                console.log(err);

                if (
                    err.data?.status === 401 &&
                    !isRefreshing.current
                ) {

                    isRefreshing.current =
                        true;

                    try {

                        console.log(
                            "refresh 시도"
                        );

                        const res =
                            await api.post(
                                "/auth/refresh",
                                {},
                                {
                                    withCredentials: true
                                }
                            );

                        const newAccessToken =
                            res.data.accessToken;

                        setAccessToken(
                            newAccessToken
                        );

                        console.log(
                            "새 accessToken 발급"
                        );

                        connectSocket(
                            newAccessToken
                        );

                    } catch (err) {

                        console.log(
                            "refresh 실패"
                        );

                    } finally {

                        isRefreshing.current =
                            false;

                    }

                }

            }
        );

    };

    // =========================
    // 최초 실행
    // =========================
    useEffect(() => {

        if (!hasHydrated) {

            console.log(
                "hydration 대기중"
            );

            return;

        }

        const init =
            async () => {

                try {

                    // 기존 채팅 조회
                    const res =
                        await api.get(
                            `${LIVE_SERVER_URL}/live/chat/${roomId}`
                        );

                    setMessages(
                        res.data
                    );

                    // access token 없으면 종료
                    if (!token) {

                        console.log(
                            "access token 없음"
                        );

                        return;

                    }

                    // socket 연결
                    connectSocket(
                        token
                    );

                } catch (err) {

                    console.log(err);

                }

            };

        init();

        return () => {

            socketRef.current?.disconnect();

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

        if (
            !socketRef.current?.connected
        ) {

            console.log(
                "socket 연결 안됨"
            );

            return;

        }

        socketRef.current.emit(
            "chat",
            {
                roomId,
                message: input
            }
        );

        setInput("");

    };

    // =========================
    // 화면
    // =========================
    return (

        <div>

            <h1>
                live broadcast
            </h1>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: "500px"
                }}
            />

            <h2>
                {roomId}
            </h2>

            <div>

                {messages.map(
                    (msg, i) => (

                        <div key={i}>

                            <strong>
                                {msg.name}
                            </strong>

                            : {msg.message}

                        </div>

                    )
                )}

            </div>

            <input
                value={input}
                onChange={(e) =>
                    setInput(
                        e.target.value
                    )
                }
            />

            <button
                onClick={sendMessage}
            >
                send
            </button>

        </div>

    );

}