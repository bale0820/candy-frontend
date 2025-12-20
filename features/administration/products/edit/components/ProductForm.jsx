"use client";

import {ImageUploadList} from "@/features/administration/products/edit/components/ImageUploadList.jsx";
import {useProductForm} from "@/features/administration/products/edit/useProductForm";
import "./ProductForm.css";

export function ProductForm({
  mode,
  initialFormData,
  existingImages,
  onSubmit,
  initialCount,
  initialPrice,
}) {
  const inputField = [
    { label: "상품명", name: "productName", placeholder: "상품명을 입력해주세요.", type: "text" },
    { label: "브랜드명", name: "brandName", placeholder: "브랜드명을 입력해주세요.", type: "text" },
    { label: "판매자", name: "seller", placeholder: "판매자명을 입력해주세요.", type: "text" },
    { label: "원산지", name: "origin", placeholder: "국산, 일본, 미국 등", type: "text" },
    { label: "판매단위", name: "unit", placeholder: "예: 1팩, 500g 등", type: "text" },
    { label: "중량/용량", name: "weight", placeholder: "예: 500g, 1kg 등", type: "text" },
    { label: "총 수량", name: "count", placeholder: "총 수량을 입력해주세요.", type: "text" },
    { label: "가격", name: "price", placeholder: "가격을 입력해주세요.", type: "text" },
    { label: "할인 정보", name: "dc", placeholder: "할인을 입력해주세요.", type: "number" },
    { label: "알레르기 정보", name: "allergyInfo", placeholder: "예: 우유, 견과류 등", type: "text" },
    { label: "상품 설명", name: "description", placeholder: "예: 맛있는 1등급 우유", type: "text" },
  ];

  const {
    handleChange,
    handleSubmit,
    handleChangeCategory,
    handleImagesSelect,
    deliveryList,
    categoryList,
    subCategoryList,
    formData,
    count,
    price,
    selectedMain,
    selectedSub,
  } = useProductForm({
    mode,
    initialFormData,
    existingImages,
    initialCount,
    initialPrice,
    inputField,
    onSubmit,
  });

  const imageNames = ["상품 이미지", "속성 이미지", "상세 이미지"];

  return (
    <div className="product-add-container">
      <h1>상품 등록</h1>

      <form onSubmit={handleSubmit} className="product-add-form">
        <div className="form-grid">
          {inputField?.map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}:</label>

              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={
                  field.name === "count"
                    ? count?.toLocaleString()
                    : field.name === "price"
                    ? price?.toLocaleString()
                    : formData[field.name]
                }
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <div className="form-group full-width">
          <label>안내사항:</label>
          <textarea
            name="notes"
            placeholder="배송 안내, 보관 방법 등"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label>배송정보:</label>
          <select name="delType" value={formData.delType} onChange={handleChange}>
            <option value="" disabled>
              배송 방법을 선택해주세요.
            </option>
            {deliveryList?.map((option, idx) => (
              <option key={idx} value={option.delType}>
                {option.delName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group full-width">
          <label>상품 분류(대분류):</label>
          <select name="cateMain" value={selectedMain} onChange={handleChangeCategory}>
            <option value="" disabled>
              상품 카테고리를 선택해주세요.
            </option>
            {categoryList?.map((option) => (
              <option key={option?.id} value={option?.id}>
                {option?.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group full-width">
          <label>상품 분류(중분류):</label>
          <select name="categorySub" value={selectedSub} onChange={handleChange}>
            <option value="" disabled>
              상품 카테고리를 선택해주세요.
            </option>
            {subCategoryList?.map((option) => (
              <option key={option?.id} value={option?.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <ImageUploadList
          onFileSelect={handleImagesSelect}
          imageNames={imageNames}
          existingImages={existingImages}
        />

        <button type="submit" className="submit-btn">
          등록
        </button>
      </form>
    </div>
  );
}
