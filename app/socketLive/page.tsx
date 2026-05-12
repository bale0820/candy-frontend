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
    // Zustand 구독
    // =========================
    const accessToken =
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

    const isRefreshing =
        useRef(false);

    const videoRef =
        useRef<HTMLVideoElement | null>(null);

    const peerRef =
        useRef<RTCPeerConnection | null>(null);

    const roomId = "live-1";

    // =========================
    // socket 연결 함수
    // =========================
    const connectSocket = (
        token: string
    ) => {

        // 기존 socket 제거
        socketRef.current?.disconnect();

        const socket = io(
            process.env.NEXT_PUBLIC_SOCKET_URL!,
            {
                auth: {
                    token
                },

                reconnection: false
            }
        );

        socketRef.current = socket;

        // =========================
        // 연결 성공
        // =========================
        socket.on(
            "connect",
            () => {

                console.log(
                    "socket 연결 성공"
                );

                // room 입장
                socket.emit(
                    "join_room",
                    roomId
                );

            }
        );

        // =========================
        // 채팅 수신
        // =========================
        socket.on(
            "chat",
            (data: ChatMessage) => {

                setMessages(prev => [
                    ...prev,
                    data
                ]);

            }
        );

        // =========================
        // 연결 실패
        // =========================
        socket.on(
            "connect_error",
            async (err: any) => {

                console.log(err);

                // 이미 refresh 중이면 막기
                if (
                    err.data?.status === 401 &&
                    !isRefreshing.current
                ) {

                    isRefreshing.current = true;

                    try {

                        console.log(
                            "refresh 시도"
                        );

                        // refresh 요청
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

                        // Zustand 저장
                        setAccessToken(
                            newAccessToken
                        );

                        console.log(
                            "새 access token 발급"
                        );

                        // 새 토큰으로 재연결
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

        // hydration 끝날 때까지 대기
        if (!hasHydrated) {

            console.log(
                "hydration 대기중"
            );

            return;

        }

        const init = async () => {

            try {

                // 기존 채팅 조회
                const res =
                    await api.get(
                        `http://192.168.219.137:8081/chat/${roomId}`
                    );

                setMessages(res.data);

                // access token 없으면 종료
                if (!accessToken) {

                    console.log(
                        "access token 없음"
                    );

                    return;

                }

                // socket 연결
                connectSocket(
                    accessToken
                );

            } catch (err) {

                console.log(err);

            }

        };

        init();

        return () => {

            socketRef.current?.off(
                "connect"
            );

            socketRef.current?.off(
                "chat"
            );

            socketRef.current?.off(
                "connect_error"
            );

            socketRef.current?.disconnect();

        };

    }, [
        hasHydrated,
        accessToken
    ]);

    // =========================
    // WebRTC
    // =========================
    useEffect(() => {

        const startMedia =
            async () => {

                try {

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
                        new RTCPeerConnection();

                    // stream 등록
                    stream
                        .getTracks()
                        .forEach(track => {

                            peerRef.current?.addTrack(
                                track,
                                stream
                            );

                        });

                    // offer 생성
                    const offer =
                        await peerRef.current?.createOffer();

                    // 내 브라우저 저장
                    await peerRef.current?.setLocalDescription(
                        offer
                    );

                    console.log(offer);

                } catch (err) {

                    console.log(err);

                }

            };

        startMedia();

    }, []);

    // =========================
    // 채팅 전송
    // =========================
    const sendMessage = () => {

        if (!input.trim()) return;

        // 연결 안 되어 있으면 종료
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