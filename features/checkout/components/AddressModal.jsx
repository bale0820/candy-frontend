"use client";

import { useState } from "react";
import { useMyOrders } from "@/features/mypage/myorders/hooks/useMyOrders";

export default function AddressModal({ onClose, onSelectAddress }) {
    const { orders } = useMyOrders();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const handleNext = () => {
        setCurrentPage((prev) =>
            prev * itemsPerPage < orders?.length ? prev + 1 : prev
        );
    };

    const handlePrev = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const currentItems = orders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSelect = (order) => {
        onSelectAddress(order);
        onClose();
    };

    return (
        <div className="overlay">
            <div className="modalBox">

                <div className="modal-header">
                    <h2>배송지 선택</h2>
                    <button onClick={onClose}>X</button>
                </div>

                <div className="modal-content">

                    {/* 주문 없음 */}
                    {orders.length === 0 && (
                        <ul className="address-modal-group">
                            <li>아직 주문 내역이 없습니다.</li>
                            <li>첫 주문을 시작해보세요!</li>
                        </ul>
                    )}

                    {/* 주문 리스트 */}
                    {orders.length > 0 &&
                        currentItems?.map((order, key) => (
                            <ul className="address-modal-group" key={key}>
                                <li className="address-modal-name">
                                    <div>{order.receiverName}</div>
                                    <div>
                                        <button onClick={() => handleSelect(order)}>선택</button>
                                    </div>
                                </li>
                                <li className="address-modal-address">
                                    ({order.zipcode}) {order.address1} {order.address2}
                                </li>
                                <li className="address-modal-phone">{order.receiverPhone}</li>
                                <li className="address-modal-memo">{order.memo}</li>
                            </ul>
                        ))}

                    {/* 페이지네이션 */}
                    {orders.length > 0 && (
                        <div className="pagination">
                            <button onClick={handlePrev} disabled={currentPage === 1}>
                                {"<"}
                            </button>
                            <span style={{ margin: "0 0.6rem" }}>
                                {currentPage} / {Math.ceil(orders.length / itemsPerPage)}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={currentPage * itemsPerPage >= orders.length}
                            >
                                {">"}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
