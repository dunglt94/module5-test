import React, {useEffect, useState} from 'react';
import axios from "axios";
import {ORDER_API_URL} from "../constants/mock-api";
import {Link} from "react-router-dom";

const Book = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState(false);

    const [displayedOrders, setdisplayedOrders] = useState([]);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [limit, setLimit] = useState("10");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${ORDER_API_URL}?_expand=product`);
                setOrders(response.data);
                setdisplayedOrders(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchOrders().then();
    }, []);

    useEffect(() => {
        const sortedOrdersByPrice = [...orders].sort((a, b) => (a.product?.price || 0) - (b.product?.price || 0));
        if (orders) {
            setdisplayedOrders(sortedOrdersByPrice);
        }
    }, [orders]);

    const sortedOrdersByTotal = [...orders].sort((a, b) => b.total - a.total);

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(new Date(dateString));
    };

    const filterOrdersByDate = () => {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const filteredByDate = orders.filter(order => {
            const orderDate = new Date(order.boughtDate);
            return (!start || orderDate >= start) && (!end || orderDate <= end);
        });

        setOrders(filteredByDate);
    };

    const filterOrdersByTotal = (limit) => {
        if (limit === "all") {
            setdisplayedOrders(sortedOrdersByTotal);
        } else {
            // Chuyển limit sang kiểu number để dùng với slice
            setdisplayedOrders(sortedOrdersByTotal.slice(0, Number(limit)));
        }
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold">Thống kê đơn hàng</h2>
                <Link to={`/add`} className="btn btn-success px-4">
                    Add a new Book
                </Link>
            </div>

            <div className="mb-3 d-flex w-auto text-center">
                <input
                    type="date"
                    className="form-control w-25"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="mx-2 align-self-center">-</span>
                <input
                    type="date"
                    className="form-control w-25 me-2"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={filterOrdersByDate} className="btn btn-secondary">Tìm</button>
            </div>

            <div className="mb-3">
                <label htmlFor="limitSelect" className="me-1">Hiển thị</label>
                <select
                    id="limitSelect"
                    onChange={(e) => setLimit(e.target.value)}
                >
                    <option value="10">10</option>
                    <option value="5">5</option>
                    <option value="all">Tất cả</option>
                </select>
                <span> đơn hàng có tổng số tiền bán cao nhất. </span>
                <button
                    className="btn btn-secondary"
                    onClick={() => filterOrdersByTotal(limit)}
                >
                    Xem
                </button>
            </div>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Mã đơn hàng</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá (USD)</th>
                    <th>Loại sản phẩm</th>
                    <th>Ngày mua</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
                    <th className="text-center">Action</th>

                </tr>
                </thead>
                <tbody className="align-middle">
                {displayedOrders.map((order, index) => {
                    const {product} = order;
                    return (
                        <tr key={order.id}>
                            <td>{index + 1}</td>
                            <td>{order.code}</td>
                            <td>{product?.name || "N/A"}</td>
                            <td>{product?.price || "N/A"}</td>
                            <td>{product?.type || "N/A"}</td>
                            <td>{formatDate(order.boughtDate)}</td>
                            <td>{order.quantity}</td>
                            <td>{order.total}</td>
                            <td className="text-center">
                                <Link
                                    to={`/edit/${order.id}`}
                                    className="btn btn-primary btn-action"
                                >
                                    Sửa
                                </Link>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    );

}

export default Book;