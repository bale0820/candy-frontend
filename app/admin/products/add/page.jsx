"use client";

import {useProductAdd} from "@/features/administration/product/add/useProductAdd";
import {ProductForm} from "@/features/administration/product/add/components/ProductForm";

export function Page() {
  const {
    initialFormData,
    initialExistingImages,
    handleSubmit,
  } = useProductAdd();

  return (
    <ProductForm
      mode="add"
      initialFormData={initialFormData}
      initialExistingImages={initialExistingImages}
      onSubmit={handleSubmit}
      initialCount={0}
      initialPrice={0}
    />
  );
}
