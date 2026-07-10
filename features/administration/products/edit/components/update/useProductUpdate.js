"use client";

import Swal from "sweetalert2";
import { useAdminProductsQuery } from "@/features/administration/products/edit/useAdminProductsQuery";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/store/proudctStore.js";
import { SetProductData } from "@/features/administration/products/edit/components/SetProductData";
import { IMAGE_BASE_URL } from "@/shared/constants/clientEnv";

export function useProductUpdate() {
    const { productUpdate }= useAdminProductsQuery();
    const router = useRouter();
    const { item } = useProductStore();
    const loading = !item;
    // 💡 기존 데이터를 기반으로 초기 formData 생성
    const initialFormData = item ? {
        productName: item.productName,
        brandName: item.brandName,
        seller: item.seller,
        origin: item.origin,
        unit: item.unit,
        weight: item.weight,
        count: item.count,
        price: item.price,
        dc: item.dc,
        allergyInfo: item.allergyInfo,
        description: item.description,
        notes: item.notes,
        delType: item.delType,
        categorySub: item.categorySub,
    } : null;

    // 💡 기존 이미지 경로
    const existingImages = item ? [
        `${IMAGE_BASE_URL}/data/productImages/${item.imageUrl}`,
        `${IMAGE_BASE_URL}/data/productInformation/${item.productInformationImage}`,
        `${IMAGE_BASE_URL}/data/productDescription/${item.productDescriptionImage}`,
    ] : [];

    // ⭐ 제출 로직
    const handleSubmit = async (formData, imageListFile) => {
        if (!item) return;

        const data = SetProductData(
          formData,
          imageListFile,
          false,             // update mode
          item?.id,
          existingImages.length
        );

        try {
            await productUpdate.mutateAsync(data);

            Swal.fire({
                icon: "success",
                title: "✅ 상품 수정 성공!",
                text: "상품이 성공적으로 수정되었습니다.",
            }).then(() => router.push("/admin/products/edit"));
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "❌ 수정 실패",
                text: "다시 시도해주세요.",
            });
        }
    };

    return {
        loading,
        item,
        initialFormData,
        existingImages,
        handleSubmit,
    };
}
