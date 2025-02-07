import React, {useEffect, useState} from 'react';
import axios from "axios";
import {ORDER_API_URL, PRODUCT_API_URL} from "../constants/mock-api";
import {Link} from "react-router-dom";

const Book = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(PRODUCT_API_URL);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchProducts().then();
    }, []);

    const getProductById = (id) => {
        return products.find(product => product.id === id);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(ORDER_API_URL);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchOrders().then();
    }, []);

    const sortedOrders = [...orders].sort((a, b) => {
        const productA = getProductById(a.productId);
        const productB = getProductById(b.productId);
        return (productA?.price || 0) - (productB?.price || 0);
    });

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

        const filtered = orders.filter(order => {
            const orderDate = new Date(order.boughtDate);
            return (!start || orderDate >= start) && (!end || orderDate <= end);
        });

        setOrders(filtered);
    };

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
                {sortedOrders.map((order, index) => {
                    const product = getProductById(order.productId);
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