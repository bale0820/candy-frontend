"use client";

import { useEffect, useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import Swal from "sweetalert2";

import { parseJwt } from "@/features/auth/parseJwt";
import { getKakaoPayment, getNaverPayment } from "@/features/checkout/api/paymentAPI";
import { api } from "@/shared/lib/axios.js";
import { useCartStore } from "@/store/cartStore";

export default function useCheckOutData() {
    const { cartList, totalPrice, totalDcPrice, shippingFee } = useCartStore();
    const [reduceCartList, setReduceCartList] = useState([]);
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);

    const [receiver, setReceiver] = useState({
        name: "",
        phone: "",
        address1: "",
        address2: "",
        zipcode: "",
        memo: "문앞에 놔주세요"
    });

    const [userFullAddress, setUserFullAddress] = useState("");
    const [userZoneCode, setUserZoneCode] = useState("");

    const [coupons, setCoupons] = useState([]);
    const [selectCoupon, setSelectCoupon] = useState(0);
    const [couponId, setCouponId] = useState(0);

    const [agree, setAgree] = useState({ terms: false, privacy: false });

    const [paymentMethod, setPaymentMethod] = useState("kakao");

    const [isChange, setIsChange] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const open = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

    const loading = !cartList || cartList.length === 0;

    // -----------------------------
    // 로그인 정보 세팅 + 장바구니 요청
    // -----------------------------
    useEffect(() => {
        const stored = localStorage.getItem("auth-storage");
        if (stored) {
            const { accessToken } = JSON.parse(stored).state;
            const payload = parseJwt(accessToken);
            setUserId(payload?.id);
        }
    }, []);


    // -----------------------------
    // cartList 준비되면 receiver 초기화
    // -----------------------------
    useEffect(() => {
        if (cartList?.length > 0 && cartList[0].user) {
            const u = cartList[0].user;
            setUser(u);

            setReceiver({
                name: u.name ?? "",
                phone: u.phone ?? "",
                address1: u.address ?? "",
                address2: "",
                zipcode: u.zonecode ?? "",
                memo: "문앞에 놔주세요"
            });

            setUserZoneCode(u.zonecode);
            setUserFullAddress(u.address);
        }
    }, [cartList]);

    // -----------------------------
    // 쿠폰 조회
    // -----------------------------
    useEffect(() => {
        if (!userId) return;

        const loadCoupons = async () => {
            const res = await api.get(`/coupon/my/${userId}`);
            setCoupons(res.data.filter(item => !item?.isUsed));
        };

        loadCoupons();
    }, [userId]);

    // -----------------------------
    // 0개 상품 제외
    // -----------------------------
    useEffect(() => {
        setReduceCartList(cartList?.filter(cart => cart?.product.count > 0) || []);
    }, [cartList]);

    // -----------------------------
    // 주소 변경 완료
    // -----------------------------
    const handleClick = () => {
        open({
            onComplete: (data) => {

                let fullAddress = data.address;
                let zonecode = data.zonecode;

                if (data.addressType === "R") {
                    if (data.bname) fullAddress += ` (${data.bname})`;
                    if (data.buildingName) fullAddress += `, ${data.buildingName}`;
                }

                setUserFullAddress(fullAddress);
                setUserZoneCode(zonecode);
                setReceiver(prev => ({ ...prev, address1: fullAddress, zipcode: zonecode }));
            }
        });
    };

    // -----------------------------
    // 최근 주소 선택
    // -----------------------------
    const handleSelectAddress = (address) => {
        setUserZoneCode(address.zipcode ?? "");
        setUserFullAddress(address.address1 ?? "");
        setReceiver({
            name: address.receiverName ?? "",
            phone: address.receiverPhone ?? "",
            address1: address.address1 ?? "",
            address2: address.address2 ?? "",
            zipcode: address.zipcode ?? "",
            memo: address.memo ?? ""   // ⭐ 핵심
        });
    };

    // -----------------------------
    // 입력값 변경
    // -----------------------------
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setReceiver(prev => ({ ...prev, [name]: value }));
    };

    // -----------------------------
    // 쿠폰 적용
    // -----------------------------
    const handleChangeCoupon = (e) => {
        
        const { value } = e.target;
        setCouponId(value);

        if (value === "0") return setSelectCoupon(0);

        const selected = coupons.find(c => c?.id == value);
        const dcRate = selected.coupon.couponDcRate;

        const base = Math.round((totalPrice - totalDcPrice) * dcRate * 0.01);

        const LIMIT = { 30: 15000, 50: 5000, 60: 10000 }[dcRate];
        setSelectCoupon(LIMIT ? Math.min(base, LIMIT) : base);
    };

    // -----------------------------
    // 약관 체크
    // -----------------------------
    const handleChangeAgree = (e) => {
        const { name, checked } = e.target;
        setAgree(prev => ({ ...prev, [name]: checked }));
    };

    // -----------------------------
    // 결제 실행
    // -----------------------------
    const handlePayment = async () => {
        if (!agree.terms || !agree.privacy) {
            return Swal.fire({
                icon: "error",
                title: "결제 실패",
                text: "❌ 약관에 동의해주세요"
            });
        }

        const paymentInfo = {
            shippingFee,
            discountAmount: totalDcPrice,
            totalAmount: totalPrice - totalDcPrice - selectCoupon + shippingFee
        };

        if (paymentMethod === "kakao") {
            await getKakaoPayment(receiver, paymentInfo, reduceCartList, couponId);
        } else {
            await getNaverPayment(receiver, paymentInfo, reduceCartList, couponId);
        }
    };

    return {
        // 🧡 상위에서 사용할 데이터
        loading,

        user,
        receiver,
        setReceiver,
        userFullAddress,
        userZoneCode,

        reduceCartList,

        totalPrice,
        totalDcPrice,
        shippingFee,

        coupons,
        selectCoupon,
        handleChangeCoupon,

        isChange,
        setIsChange,
        isOpen,
        setIsOpen,

        handleClick,
        handleSelectAddress,
        handleChangeValue,

        agree,
        handleChangeAgree,

        paymentMethod,
        setPaymentMethod,

        handlePayment
    };
}
