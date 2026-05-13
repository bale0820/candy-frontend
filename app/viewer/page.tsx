"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

import {
    LIVE_SERVER_URL
} from "@/shared/constants/clientEnv";

import {
    useAuthStore
} from "@/store/authStore";

export default function Viewer() {

    // =========================
    // socket
    // =========================
    const socketRef =
        useRef<Socket | null>(null);

    // =========================
    // peer
    // =========================
    const peerRef =
        useRef<RTCPeerConnection | null>(null);

    // =========================
    // remote video
    // =========================
    const remoteVideoRef =
        useRef<HTMLVideoElement | null>(null);

    // =========================
    // token
    // =========================
    const token =
        useAuthStore(
            state => state.accessToken
        );
    const hasHydrated =
        useAuthStore(
            state => state._hasHydrated
        );

    const roomId = "live-1";

    useEffect(() => {
        console.log("viewer useEffect 실행");
        if (!hasHydrated) return;
        if (!token) return;

        // =========================
        // peer 생성 먼저
        // =========================
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

        // =========================
        // 상대 영상 받기
        // =========================
        peerRef.current.ontrack =
            async (event) => {

                console.log(
                    event.track.kind
                );

                if (
                    event.track.kind !== "video"
                ) return;

                if (!remoteVideoRef.current)
                    return;

                remoteVideoRef.current.srcObject =
                    event.streams[0];

                console.log(
                    remoteVideoRef.current.readyState
                );

                try {

                    await remoteVideoRef.current.play();

                    console.log(
                        "play 성공"
                    );

                } catch (err) {

                    console.log(
                        "play 실패"
                    );

                    console.log(err);

                }

            };

        // =========================
        // 연결 상태 확인
        // =========================
        peerRef.current.onconnectionstatechange =
            () => {

                console.log(
                    "connection state:",
                    peerRef.current?.connectionState
                );

            };

        // =========================
        // ICE 상태 확인
        // =========================
        peerRef.current.oniceconnectionstatechange =
            () => {

                console.log(
                    "ICE state:",
                    peerRef.current?.iceConnectionState
                );

            };

        // =========================
        // ICE 생성
        // =========================
        peerRef.current.onicecandidate =
            (event) => {

                if (!event.candidate) return;

                console.log(
                    "viewer ICE 생성"
                );

                socketRef.current?.emit(
                    "ice-candidate",
                    {
                        roomId,
                        candidate:
                            event.candidate
                    }
                );

            };

        // =========================
        // socket 연결
        // =========================
        socketRef.current = io(
            LIVE_SERVER_URL,
            {
                path: "/live/socket.io",

                auth: {
                    token
                }
            }
        );

        // =========================
        // socket connect
        // =========================
        socketRef.current.on(
            "connect",
            () => {

                console.log(
                    "viewer socket connect"
                );

                // room 입장
                socketRef.current?.emit(
                    "join_room",
                    roomId
                );

            }
        );

        // =========================
        // 연결 실패 확인
        // =========================
        socketRef.current.on(
            "connect_error",
            (err) => {

                console.log(
                    "connect error"
                );

                console.log(err);

            }
        );

        // =========================
        // offer 수신
        // =========================
        socketRef.current.on(
            "offer",
            async (offer) => {

                try {

                    console.log(
                        "offer 수신"
                    );

                    console.log(offer);

                    // broadcaster offer 저장
                    await peerRef.current?.setRemoteDescription(
                        new RTCSessionDescription(
                            offer
                        )
                    );

                    console.log(
                        "remoteDescription 저장 완료"
                    );

                    // answer 생성
                    const answer =
                        await peerRef.current?.createAnswer();

                    if (!answer) return;

                    // 내 answer 저장
                    await peerRef.current?.setLocalDescription(
                        answer
                    );

                    console.log(
                        "answer 생성 완료"
                    );

                    // broadcaster 전송
                    socketRef.current?.emit(
                        "answer",
                        {
                            roomId,
                            answer
                        }
                    );

                } catch (err) {

                    console.log(
                        "offer 처리 실패"
                    );

                    console.log(err);

                }

            }
        );

        // =========================
        // ICE 수신
        // =========================
        socketRef.current.on(
            "ice-candidate",
            async (candidate) => {

                try {

                    console.log(
                        "viewer ICE 수신"
                    );

                    if (
                        peerRef.current
                    ) {

                        await peerRef.current.addIceCandidate(
                            new RTCIceCandidate(
                                candidate
                            )
                        );

                    }

                } catch (err) {

                    console.log(
                        "ICE 추가 실패"
                    );

                    console.log(err);

                }

            }
        );

        // =========================
        // 모든 socket 이벤트 확인
        // =========================
        socketRef.current.onAny(
            (event, ...args) => {

                console.log(
                    "socket event:",
                    event
                );

                console.log(args);

            }
        );

        // =========================
        // cleanup
        // =========================
        return () => {

            socketRef.current?.disconnect();

            peerRef.current?.close();

        };

    }, [token, hasHydrated]);

    return (

        <div>

            <h1>
                viewer
            </h1>

            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                muted
                controls
                style={{
                    width: "500px",
                    height: "300px",
                    backgroundColor: "black"
                }}
            />

        </div>

    );

}