"use client";

import React from "react";
import { ProductForm } from "@/features/administration/products/edit/components/ProductForm.jsx";
import { useProductAdd } from "@/features/administration/products/edit/components/add/useProductAdd.js";

export default function ProductAdd() {
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
