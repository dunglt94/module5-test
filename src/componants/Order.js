import React, {useEffect, useState} from 'react';
import axios from "axios";
import {ORDER_API_URL, PRODUCT_API_URL} from "../constants/mock-api";
import {Link} from "react-router-dom";

const Book = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const [displayedOrders, setDisplayedOrders] = useState([]);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [limit, setLimit] = useState("10");
    const [productId, setProductId] = useState("none");


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${ORDER_API_URL}?_expand=product`);
                setOrders(response.data);
                setDisplayedOrders(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchOrders().then();
    }, []);

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

    const sortedOrdersByPrice = [...orders].sort((a, b) => (a.product?.price || 0) - (b.product?.price || 0));
    useEffect(() => {
        if (orders) {
            setDisplayedOrders(sortedOrdersByPrice);
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

    const filterOrders = () => {
        let filtered = [...orders];

        if (startDate && endDate) {
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            filtered = filtered.filter(order => {
                const orderDate = new Date(order.boughtDate);
                return (!start || orderDate >= start) && (!end || orderDate <= end);
            });

            setDisplayedOrders(filtered);
        }

        if (productId !== "none") {
            filtered = filtered.filter(order => order.productId === Number(productId));
            setDisplayedOrders(filtered);
        }
    };


    const SortOrdersByTotal = (limit) => {
        if (limit === "all") {
            setDisplayedOrders(sortedOrdersByTotal);
        } else {
            // Chuyển limit sang kiểu number để dùng với slice
            setDisplayedOrders(sortedOrdersByTotal.slice(0, Number(limit)));
        }
    }

    const resetList = () => {
        setDisplayedOrders(sortedOrdersByPrice);
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
                <button onClick={filterOrders} className="btn btn-secondary">Tìm</button>
            </div>

            <div className="mb-3 d-flex me-1">
                <label
                    htmlFor="limitSelect"
                    className="me-1 align-self-center"
                >
                    Tìm đơn hàng theo sản phẩm
                </label>
                <select
                    name="productId"
                    id="productId"
                    className="col-4 form-control w-auto me-1"
                    onChange={(e) => setProductId(e.target.value)}
                >
                    <option value="none">Chọn sản phẩm</option>
                    {products.map((product) => (
                        <option key={product.id} value={parseInt(product.id)}>
                            {product.name}
                        </option>
                    ))}
                </select>
                <button
                    className="btn btn-secondary"
                    onClick={filterOrders}
                >
                    Tìm
                </button>
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
                    onClick={() => SortOrdersByTotal(limit)}
                >
                    Xem
                </button>
            </div>

            <div className="mb-3">
                <button onClick={resetList} className="btn btn-primary">Reset</button>
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