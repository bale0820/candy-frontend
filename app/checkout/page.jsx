"use client";

import BuyerInfo from "@/features/checkout/components/BuyerInfo";
import ReceiverInfo from "@/features/checkout/components/ReceiverInfo";
import OrderItemList from "@/features/checkout/components/OrderItemList";
import PaymentInfo from "@/features/checkout/components/PaymentInfo";
import PaymentMethod from "@/features/checkout/components/PaymentMethod";
import TermsAgree from "@/features/checkout/components/TermsAgree";
import PayButton from "@/features/checkout/components/PayButton";
import useCheckOutData from "@/features/checkout/hooks/useCheckOutData";
import "./CheckOut.scss";

export default function checkout() {
    const checkout = useCheckOutData();

    return (
        <div className="checkout-container">
            <h2 className="checkout-header">주문/결제</h2>

            <BuyerInfo user={checkout.user} />

            <ReceiverInfo
                receiver={checkout.receiver}
                setReceiver={checkout.setReceiver}
                userFullAddress={checkout.userFullAddress}
                userZoneCode={checkout.userZoneCode}
                isChange={checkout.isChange}
                setIsChange={checkout.setIsChange}
                isOpen={checkout.isOpen}
                setIsOpen={checkout.setIsOpen}
                handleClick={checkout.handleClick}
                handleSelectAddress={checkout.handleSelectAddress}
                handleChangeValue={checkout.handleChangeValue}
            />

            <OrderItemList reduceCartList={checkout.reduceCartList} />

            <PaymentInfo
                totalPrice={checkout.totalPrice}
                totalDcPrice={checkout.totalDcPrice}
                shippingFee={checkout.shippingFee}
                coupons={checkout.coupons}
                selectCoupon={checkout.selectCoupon}
                handleChangeCoupon={checkout.handleChangeCoupon}
            />

            <PaymentMethod
                paymentMethod={checkout.paymentMethod}
                setPaymentMethod={checkout.setPaymentMethod}
            />

            <TermsAgree
                agree={checkout.agree}
                handleChangeAgree={checkout.handleChangeAgree}
            />

            <PayButton handlePayment={checkout.handlePayment} />
        </div>
    )
}