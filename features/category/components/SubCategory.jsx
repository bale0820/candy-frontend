"use client";

import { useRouter } from "next/navigation";

export function SubCategory({ sub }) {
    const router = useRouter();

    const goSub = (e) => {
        e.stopPropagation();
        router.push(
            `/search/category/${encodeURIComponent(sub.name)}?`
            + new URLSearchParams({ type: "sub", id: sub?.id }).toString()
        );
    };

    return <li onClick={goSub}>{sub.name}</li>;
}
