"use client";

import { useProductAdd } from "@/features/administration/products/edit/components/add/useProductAdd";
import { ProductForm } from "@/features/administration/products/edit/components/ProductForm";

export default function Page() {
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
