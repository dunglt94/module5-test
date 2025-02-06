import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ORDER_API_URL, PRODUCT_API_URL } from "../constants/mock-api";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
    code: Yup.string().required("Mã đơn hàng là bắt buộc"),
    product_id: Yup.number().required("Sản phẩm là bắt buộc"),
    boughtDate: Yup.date()
        .max(new Date(), "Ngày mua không được lớn hơn ngày hiện tại")
        .required("Ngày mua là bắt buộc"),
    quantity: Yup.number()
        .positive("Số lượng phải lớn hơn 0")
        .integer("Số lượng phải là số nguyên")
        .required("Số lượng là bắt buộc"),
});

const OrderForm = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState()

    useEffect(() => {
        axios
            .get(PRODUCT_API_URL)
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => console.error(error));
    }, []);

    const handleOnSubmit = (values) => {
        axios
            .post(ORDER_API_URL, values)
            .then((res) => {
                alert(`Order "${res.data.code}" added successfully! Status ${res.status}!`);
                navigate("/");
            })
            .catch((error) => console.error(error));
    };

    const initialValues = {
        code: "",
        product_id: "",
        boughtDate: "",
        quantity: "",
        total: 0,
    };

    const calculateTotal = (productId, quantity) => {
        const product = products.find((p) => p.id === productId);
        if (product && quantity > 0) {
            setTotal(product.price * quantity);
        } else {
            setTotal(0);
        }
    };

    return (
        <div className="mt-5 ms-5">
            <h2>Tạo đơn hàng mới</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleOnSubmit}
                enableReinitialize
            >
                {({ setFieldValue, values }) => (
                    <Form className="col-6 ms-4 mt-4">
                        <div className="row mb-3">
                            <label htmlFor="code" className="col-2">Mã đơn hàng</label>
                            <Field
                                type="text"
                                name="code"
                                id="code"
                                className="col-4 form-control w-auto"
                            />
                            <ErrorMessage name="code" component="div" className="error text-danger"/>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="product_id" className="col-2">Sản phẩm</label>
                            <Field
                                as="select"
                                name="product_id"
                                id="product_id"
                                className="col-4 form-control w-auto"
                                onChange={(e) => {
                                    const productId = e.target.value;
                                    setFieldValue("product_id", productId);
                                    calculateTotal(Number(productId), values.quantity); // Make sure state is updated properly
                                }}
                                value={values.product_id}
                            >
                                <option value="">Chọn sản phẩm</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="product_id" component="div" className="error text-danger"/>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="boughtDate" className="col-2">Ngày mua</label>
                            <Field
                                type="date"
                                name="boughtDate"
                                id="boughtDate"
                                className="col-4 form-control w-auto"
                            />
                            <ErrorMessage name="boughtDate" component="div" className="error text-danger"/>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="quantity" className="col-2">Số lượng</label>
                            <Field
                                type="number"
                                name="quantity"
                                id="quantity"
                                className="col-4 form-control w-auto"
                                onChange={(e) => {
                                    const quantity = e.target.value;
                                    setFieldValue("quantity", quantity);
                                    calculateTotal(values.product_id, quantity);
                                }}
                            />
                            <ErrorMessage name="quantity" component="div" className="error text-danger"/>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="total" className="col-2">Tổng giá trị</label>
                            <div className="col-4">
                                <Field
                                    type="text"
                                    name="total"
                                    id="total"
                                    className="form-control w-auto"
                                    value={total} // Hiển thị tổng giá trị
                                    readOnly
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success">Tạo đơn hàng</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default OrderForm;
