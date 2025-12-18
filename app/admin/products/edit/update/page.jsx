"use client";

import React from "react";
import {useProductUpdate} from "@/features/administration/products/edit/components/update/useProductUpdate.js";
import {ProductForm} from "@/features/administration/products/edit/components/ProductForm.jsx";

export default function ProductUpdate() {
  const { loading ,item, initialFormData, existingImages, handleSubmit } = useProductUpdate();

  if(loading){
      return <div>로딩 중...</div>;
  }

  return (
    <ProductForm
      mode="update"
      initialFormData={initialFormData}
      existingImages={existingImages}
      onSubmit={handleSubmit}
      initialCount={item.count}
      initialPrice={item.price}
    />
  );
}
