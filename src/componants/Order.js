import React, {useEffect, useState} from 'react';
import axios from "axios";
import {ORDER_API_URL, PRODUCT_API_URL} from "../constants/mock-api";
import {Link} from "react-router-dom";

const Book = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get(PRODUCT_API_URL)
            .then((response) => {
                setProducts(response.data)
                console.log(response.data)
            })
            .catch((error) => console.error(error));
    }, []);

    const getProductById = (id) => {
        return products.find(product => product.id === id);
    };

    useEffect(() => {
        axios
            .get(ORDER_API_URL)
            .then((response) => {
                setOrders(response.data)
                console.log(response.data)
            })
            .catch((error) => console.error(error));
    }, []);





    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold">Thống kê đơn hàng</h2>
                <Link to={`/add`} className="btn btn-success px-4">
                    Add a new Book
                </Link>
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
                    <th>Action</th>

                </tr>
                </thead>
                <tbody className="align-middle">
                {orders.map((order, index) => {
                    const product = getProductById(order.product_id);
                    return (
                    <tr key={order.id}>
                        <td>{index + 1}</td>
                        <td>{order.code}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.type}</td>
                        <td>{order.boughtDate}</td>
                        <td>{order.quantity}</td>
                        <td>{order.total}</td>
                        <td>
                            <Link
                                to={`/edit/${order.id}`}
                                className="btn btn-primary me-2 btn-action w-50"
                            >
                                Sửa
                            </Link>
                        </td>
                    </tr>
                )})}
                </tbody>
            </table>
        </div>
    );

}

export default Book;