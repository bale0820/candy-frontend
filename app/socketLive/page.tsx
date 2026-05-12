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

    const roomId = "live-1";

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
                                urls: [
                                    "stun:stun.l.google.com:19302"
                                ]
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

                        if (
                            peerRef.current?.remoteDescription
                        ) {

                            await peerRef.current.addIceCandidate(
                                candidate
                            );

                        }

                    }
                );

                // ICE 생성
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

                    socketRef.current?.emit(
                        "join_room",
                        roomId
                    );

                    await startMedia();

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

        connectSocket(token);

        return () => {

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

        <div>

            <h1>
                broadcaster
            </h1>

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: "500px",
                    height: "300px",
                    backgroundColor: "black"
                }}
            />

            <button
                onClick={createOffer}
            >
                offer 재전송
            </button>

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