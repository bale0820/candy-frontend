"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
    LIVE_SERVER_URL
} from "@/shared/constants/clientEnv";
import { useAuthStore } from "@/store/authStore";

export default function Viewer() {

    const socketRef =
        useRef<Socket | null>(null);

    const peerRef =
        useRef<RTCPeerConnection | null>(null);

    const remoteVideoRef =
        useRef<HTMLVideoElement | null>(null);

    const token =
        useAuthStore(
            state => state.accessToken
        );

    const roomId = "live-1";

    useEffect(() => {

        // socket 연결
        socketRef.current = io(
            LIVE_SERVER_URL,
            {
                path: "/live/socket.io",

                auth: {
                    token
                }
            }
        );

        // room 입장
        socketRef.current.emit(
            "join_room",
            roomId
        );

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


        // 상대 영상 받기
        peerRef.current.ontrack =
            (event) => {

                console.log(event);

                if (
                    remoteVideoRef.current
                ) {

                    remoteVideoRef.current.srcObject =
                        event.streams[0];

                }

            };

        // offer 받기
        socketRef.current.on(
            "offer",
            async (offer) => {

                console.log(offer);

                // broadcaster offer 저장
                await peerRef.current?.setRemoteDescription(
                    offer
                );

                // answer 생성
                const answer =
                    await peerRef.current?.createAnswer();

                // 내 answer 저장
                await peerRef.current?.setLocalDescription(
                    answer
                );

                // broadcaster에게 answer 전송
                socketRef.current?.emit(
                    "answer",
                    {
                        roomId,
                        answer
                    }
                );

            }
        );

        socketRef.current.on(
            "ice-candidate",
            async (candidate) => {

                if (
                    peerRef.current?.remoteDescription
                ) {

                    await peerRef.current.addIceCandidate(
                        candidate
                    );

                }

            }
        );

        peerRef.current.onicecandidate =
            (event) => {

                if (event.candidate) {

                    socketRef.current?.emit(
                        "ice-candidate",
                        {
                            roomId,
                            candidate: event.candidate
                        }
                    );

                }

            };

    }, []);

    return (

        <div>

            <h1>viewer</h1>

            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: "500px"
                }}
            />

        </div>

    );

}