import React, {useEffect, useState} from "react";
import {Formik} from "formik";
import axios from "axios";
import {ORDER_API_URL, PRODUCT_API_URL,} from "../constants/mock-api";
import {useNavigate} from "react-router-dom";


const OrderForm = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState({total: 0})
    const [products, setProducts] = useState([]);

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

    const handleValidate = () => {
        const errors = {};

        if (!order.code) {
            errors.code = "Không được để trống";
        }

        if (!order.productId) {
            errors.productId = "Không được để trống";
        }

        if (!order.boughtDate) {
            errors.boughtDate = "Không được để trống";
        }

        if (new Date(order.boughtDate).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
            errors.boughtDate = "Ngày mua không được lớn hơn ngày hiện tại";
        }


        if (!order.quantity) {
            errors.quantity = "Không được để trống";
        }

        if (order.quantity <= 0) {
            errors.quantity = "Số lượng phải lớn hơn 0";
        }

        if (!Number.isInteger(order.quantity)) {
            errors.quantity = "Số lượng phải là số nguyên";
        }

        return errors;
    }

    useEffect(() => {
        if (order.productId && order.quantity) {
            const selectedProduct = products.find(product => product.id === order.productId);
            if (selectedProduct) {
                setOrder(prevOrder => ({
                    ...prevOrder,
                    total: selectedProduct.price * order.quantity
                }));
            }
        }
    }, [order.productId, order.quantity, products]);

    const handleChange = (e) => {
        setOrder({
            ...order, [e.target.name]: e.target.name === "productId" || e.target.name === "quantity"
                ? parseInt(e.target.value)
                : e.target.value,
        });
        console.log(order);
    }


    const handleSubmit = () => {
        axios
            .post(ORDER_API_URL, order)
            .then((res) => {
                alert(`Order "${res.data.code}" added successfully! Status ${res.status}!`);
                console.log(res.data)
                navigate("/");
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className="mt-5 ms-5">
            <h2>Tạo đơn hàng mới</h2>
            <Formik
                initialValues={order}
                validate={handleValidate}
                onSubmit={handleSubmit}
            >
                {({errors, handleSubmit}) => (
                    <form onSubmit={handleSubmit} className="col-6 ms-4 mt-4">
                        <div className="row mb-3">
                            <label htmlFor="code" className="col-2">Mã đơn hàng</label>
                            <input
                                type="text"
                                name="code"
                                id="code"
                                className="col-4 form-control w-auto"
                                onChange={handleChange}
                            />
                            <p className={"error text-danger"}>{errors.code}</p>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="productId" className="col-2">Sản phẩm</label>
                            <select
                                name="productId"
                                id="productId"
                                className="col-4 form-control w-auto"
                                onChange={handleChange}
                            >
                                <option value="">Chọn sản phẩm</option>
                                {products.map((product) => (
                                    <option key={product.id} value={parseInt(product.id)}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <p className={"error text-danger"}>{errors.productId}</p>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="boughtDate" className="col-2">Ngày mua</label>
                            <input
                                type="date"
                                name="boughtDate"
                                id="boughtDate"
                                className="col-4 form-control w-auto"
                                onChange={handleChange}
                            />
                            <p className={"error text-danger"}>{errors.boughtDate}</p>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="quantity" className="col-2">Số lượng</label>
                            <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                className="col-4 form-control w-auto"
                                onChange={handleChange}
                            />
                            <p className={"error text-danger"}>{errors.quantity}</p>
                        </div>
                        <div className="row mb-3">
                        <label htmlFor="total" className="col-2">Tổng giá trị</label>
                            <div className="col-4 p-0">
                                <input
                                    type="number"
                                    name="total"
                                    id="total"
                                    className="form-control w-auto"
                                    value={order.total}
                                    readOnly
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success">Tạo đơn hàng</button>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default OrderForm;