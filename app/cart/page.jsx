"use client";

import { CartItemList } from "@/features/cart/components/CartItemList";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { CartEmpty } from "@/features/cart/components/CartEmpty";
import "./Cart.scss";
import { useCart } from "@/features/cart/useCart";

export default function Cart() {
  const {
    cartList,
    totalPrice,
    totalDcPrice,
    shippingFee,
    decreaseQty,
    increaseQty,
    removeItem,
    goCheckout,
  } = useCart();
  return (
    <div className="cart-container">
      <h2 className="cart-header">장바구니</h2>
      <div className="cart-body">
        {cartList.length > 0 ? (
          <>
            <CartItemList
              cartList={cartList}
              decreaseQty={decreaseQty}
              increaseQty={increaseQty}
              removeItem={removeItem}
            />
            <CartSummary
              totalPrice={totalPrice}
              totalDcPrice={totalDcPrice}
              shippingFee={shippingFee}
              goCheckout={goCheckout}
            />
          </>
        ) : (
          <CartEmpty />
        )}
      </div>
    </div>
  );
}
