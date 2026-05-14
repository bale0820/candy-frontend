"use client";

import "./BrodcastList.scss";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/axios";
import { useRouter } from "next/navigation";
import { LIVE_SERVER_URL } from "@/shared/constants/clientEnv";

interface LiveBroadcast {
  id: number;
  title: string;
  roomId: string;
  thumbnail: string | null;
  isLive: boolean;
  startedAt: string;
}

interface Props {
  productId: string;
}

export default function BrodcastList({
  productId,
}: Props) {

  const router = useRouter();

  const {
    data: liveList = [],
    isLoading: loading,
  } = useQuery<LiveBroadcast[]>({
    queryKey: ["broadcastList", productId],

    queryFn: async () => {

      const res = await api.get(
        `${LIVE_SERVER_URL}/live/product/${productId}`
      );

      return res.data;

    },

    staleTime: 1000 * 60,
  });
  return (
    <div className="broadcast-container">

      <h1 className="broadcast-title">
        실시간 방송 목록
      </h1>

      {loading ? (

        <p className="loading">
          로딩 중...
        </p>

      ) : liveList.length > 0 ? (

        <div className="broadcast-grid">

          {liveList.map((live) => (

            <div
              key={live.id}
              className="broadcast-card"
            >

              <div className="thumbnail-wrap">

                <img
                  src={
                    live.thumbnail ||
                    "/default-live.jpg"
                  }
                  alt={live.title}
                  className="thumbnail"
                />

                {live.isLive && (
                  <span className="live-badge">
                    LIVE
                  </span>
                )}

              </div>

              <div className="broadcast-info">

                <h2>{live.title}</h2>

                <p>
                  시작시간:
                  {" "}
                  {new Date(
                    live.startedAt
                  ).toLocaleString()}
                </p>

              </div>

              <button
                className="enter-button"
                onClick={() =>
                  router.push(
                    `/viewer/${live.roomId}`
                  )
                }
              >
                방송 입장
              </button>

            </div>

          ))}

        </div>

      ) : (

        <p className="empty">
          진행 중인 방송이 없습니다.
        </p>

      )}

    </div>
  );
}