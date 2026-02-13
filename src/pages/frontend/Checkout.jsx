import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { currency } from "../../utils/filter";
import { RotatingLines } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import SingleProductModal from "../../components/SingleProductModal";
import { emailValidation, twPhoneValidation } from "../../utils/validation";
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
const VITE_API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
    const [ cart, setCart ] = useState([]);
    const [ products, setProducts ] = useState([]);
    const [ product, setProduct ] = useState(null);
    const [ loadingCartId, setLoadingCartId ] = useState(null);
    const [ loadingProductId, setLoadingProductId ] = useState(null);
    const productModalRef = useRef(null);

    // useForm 表單驗證
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm({
        mode: "onChange"
    });

    // 取得產品列表
    const getProducts = async () => {
        try {
            const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/products`);
            setProducts(res.data.products);
        } catch (error) {
            console.error("取得產品列表失敗:", error);
        }
    }

    // 取得購物車列表
    const getCart = async () => {
        try {
            const responses = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
            setCart(responses.data.data);
        } catch (error) {
            console.error("取得購物車列表失敗:", error);
        }
    }

    // 查看產品細節
    const handleViewMore = async (id) => {
        setLoadingProductId(id);
        try {
            const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/product/${id}`);
            setProduct(res.data.product);
        } catch (error) {
            console.error("取得產品細節失敗:", error);
        } finally {
            setLoadingProductId(null);
        }

        productModalRef.current.show();
    }

    const closeModal = () => {
        productModalRef.current.hide();
    }

    // 加入購物車
    const addCart = async (id, qty = 1) => {
        setLoadingCartId(id);
        try {
            const data = {
                data: {
                    product_id: id,
                    qty: qty
                }
            }
            const response = await axios.post(
                `${VITE_API_BASE}/api/${VITE_API_PATH}/cart`,
                data,
            );
            // console.log("加入購物車成功:", response.data);
            getCart();
            //navigate("/cart");
        } catch (error) {
            console.error("加入購物車失敗:", error);
        } finally {
            setLoadingCartId(null);
            productModalRef.current.hide();
        }
    }

    // 更新購物車數量
    const updateCart = async (cartId, productId, qty=1) => {
        try {
            const data = {
                data: {
                    product_id: productId,
                    qty: qty
                }
            }
            getCart();
        } catch (error) {
            console.error("更新購物車失敗:", error);
        }
    }

    // 刪除一筆購物車項目
    const deleteCart = async (cartId) => {
        try {
            const response = await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart/${cartId}`);
            // console.log("刪除購物車成功:", response.data);
            // 更新購物車列表
            getCart();
        } catch (error) {
            console.error("刪除購物車失敗:", error);
        }
    }

    // 清空購物車
    const clearCart = async () => {
        try {
            const response = await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/carts`);
            // console.log("清空購物車成功:", response.data);
            // 更新購物車列表
            const responses2 = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
            // console.log("取得購物車列表成功:", responses2.data.data);
            setCart(responses2.data.data);
        } catch (error) {
            console.error("清空購物車失敗:", error);
        }
    }

    // 取得表單資料
    const onSubmit = async (formData) => {
        try {
            const data = {
                data: {
                    user: formData,
                    message: formData.message,
                }
            }
            const response = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/order`, data);
            // 更新購物車列表
            const responses2 = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
            // console.log("取得購物車列表成功:", responses2.data.data);
            setCart(responses2.data.data);
            // 清空表單
            alert("訂單送出成功: " + response.data.message);
            reset();
        } catch (error) {
            console.error("送出訂單失敗:", error);
        }
    }

    useEffect(() => {
        productModalRef.current = new bootstrap.Modal('#productModal', {
            keyboard: false
        });

        // Modal 關閉時移除焦點
        document
        .querySelector("#productModal")
        .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        });

        getProducts();
        getCart();
    }, [])

    return (<>
        <div className="container">
            {/* 產品列表 */}
            <table className="table align-middle">
            <thead>
                <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    products?.map(product => (
                    <tr key={product.id}>
                    <td style={{ width: "200px" }}>
                        <div
                        style={{
                            height: "100px",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${product.imageUrl})`,
                        }}
                        ></div>
                    </td>
                    <td>{product.title}</td>
                    <td>
                        <del className="h6">原價：{product.origin_price}</del>
                        <div className="h5">特價：{product.price}</div>
                    </td>
                    <td>
                        <div className="btn-group btn-group-sm">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => handleViewMore(product.id)}
                            disabled={loadingProductId === product.id}
                        >
                            {
                                loadingProductId === product.id ? (
                                    <RotatingLines color="gray" width={80} height={16} />
                                ) : "查看細節"
                            }
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => addCart(product.id, 1)}
                            disabled={loadingCartId === product.id}
                        >
                            {
                                loadingCartId === product.id ? (
                                    <RotatingLines color="gray" width={80} height={16} />
                                ) : "加入購物車"
                            }
                        </button>
                        </div>
                    </td>
                    </tr>
                    ))
                }
            </tbody>
            </table>
            <h2>購物車列表</h2>
            <div className="text-end mt-4">
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => clearCart()}
                >
                    清空購物車
                </button>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">品名</th>
                    <th scope="col">數量/單位</th>
                    <th scope="col">小計</th>
                </tr>
                </thead>
                <tbody>
                    {
                        cart?.carts?.map(cartItem => (
                        <tr key={cartItem.id}>
                            <td>
                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteCart(cartItem.id)}
                            >
                                刪除
                            </button>
                            </td>
                            <th scope="row">
                                {cartItem.product.title}
                            </th>
                            <td>
                                <div className="input-group input-group-sm mb-3">
                                    <input
                                        type="number"
                                        className="form-control"
                                        aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"
                                        defaultValue={cartItem.qty}
                                        onChange={(e) => updateCart(cartItem.id, cartItem.product_id, Number(e.target.value))}
                                    />
                                    <span className="input-group-text" id="inputGroup-sizing-sm">{cartItem.product.unit}</span>
                                    </div>
                            </td>
                            <td className="text-end">{currency(cartItem.final_total)}</td>
                        </tr>

                        ))
                    }
                </tbody>
                <tfoot>
                <tr>
                    <td className="text-end" colSpan="3">
                    總計
                    </td>
                    <td className="text-end">{currency(cart.final_total)}</td>
                </tr>
                </tfoot>
            </table>

            {/* 結帳頁面 */}
            <div className="my-5 row justify-content-center">
            <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="請輸入 Email"
                    defaultValue=""
                    {...register("email", emailValidation)}
                />
                {errors.email && (
                    <p className="text-danger">{errors.email.message}</p>
                )}
                </div>

                <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    收件人姓名
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="請輸入姓名"
                    defaultValue="小明"
                    {...register("name", {
                        required: "請輸入姓名",
                        minLength: {
                            value: 2,
                            message: "姓名至少需要 2 個字",
                        },
                    })}
                />
                {errors.name && (
                    <p className="text-danger">{errors.name.message}</p>
                )}
                </div>

                <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                    收件人電話
                </label>
                <input
                    id="tel"
                    name="tel"
                    type="tel"
                    className="form-control"
                    placeholder="請輸入電話"
                    defaultValue="0912345678"
                    {...register("tel", twPhoneValidation)}
                />
                {errors.tel && (
                    <p className="text-danger">{errors.tel.message}</p>
                )}
                </div>

                <div className="mb-3">
                <label htmlFor="address" className="form-label">
                    收件人地址
                </label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    className="form-control"
                    placeholder="請輸入地址"
                    defaultValue="臺北市信義區信義路5段7號"
                    {...register("address", {
                        required: "請輸入地址",
                    })}
                />
                {errors.address && (
                    <p className="text-danger">{errors.address.message}</p>
                )}
                </div>

                <div className="mb-3">
                <label htmlFor="message" className="form-label">
                    留言
                </label>
                <textarea
                    id="message"
                    className="form-control"
                    cols="30"
                    rows="10"
                    {...register("message")}
                ></textarea>
                {errors.message && (
                    <p className="text-danger">{errors.message.message}</p>
                )}
                </div>
                <div className="text-end">
                <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={!isValid}>
                    送出訂單
                </button>
                </div>
            </form>
            </div>
            {/* 產品細節 Modal */}
            <SingleProductModal product={product} addCart={addCart} closeModal={closeModal} />
        </div>
    </>)
}

export default Checkout;