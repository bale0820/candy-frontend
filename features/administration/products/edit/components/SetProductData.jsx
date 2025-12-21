import {parseJwt} from "@/features/auth/parseJwt";

export function SetProductData(formData, imageListFile, isNew, id, maxImageLength) {
    // 토큰 확인
    const stored = localStorage.getItem("auth-storage");

    if (stored) {
        let url ="";

        // 토큰에서 user의 id취득
        const { accessToken } = JSON.parse(stored).state;
        const payload = parseJwt(accessToken);

        // 이미지 전송을 위한 FormData
        const data = new FormData();

        // user의 id설정
        formData = {...formData, "user": { "id": payload?.id } };

        // 신규 등록이 아닐 경우
        if(!isNew) {
            // 상품의 id설정
            formData = {...formData, "id": id  };
        }

        // 이미지 파일 추가
        for (let i = 0; i < maxImageLength; i++) {
            if (imageListFile[i]) {
                data.append("files", imageListFile[i]);
            } else {
                data.append("files", new Blob([]));
            }
        }

        // formData설정(String타입으로 전송)
        data.append("product", JSON.stringify(formData));

        return data;
    }
}
