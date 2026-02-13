import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
const VITE_API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
    const [ cart, setCart ] = useState([]);

    useEffect(() => {
        const getCart = async ()=> {
            try {
                const responses = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
                // console.log("取得購物車列表成功:", responses.data.data);
                setCart(responses.data.data);
            } catch (error) {
                console.error("取得購物車列表失敗:", error);
            }
        }
        getCart();
    }, [])

    // 取得購物車列表
    const getCart = async () => {
        try {
            const responses = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
            // console.log("取得購物車列表成功:", responses.data.data);
            setCart(responses.data.data);
        } catch (error) {
            console.error("取得購物車列表失敗:", error);
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

    return (<>
        <div className="container">
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
        </div>
    </>)
}

export default Cart;