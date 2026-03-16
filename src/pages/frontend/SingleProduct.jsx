import axios from "axios";
import useProducts from "../../hooks/useProducts";
import { useParams, useNavigate } from "react-router-dom";
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
const VITE_API_PATH = import.meta.env.VITE_API_PATH;
function SingleProduct() {
    const params = useParams();
    const { id } = params;
    const navigate = useNavigate();
    const { products, loading, error } = useProducts();
    const addCart = async (id, qty = 1) => {
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
            // navigate("/cart");
        } catch (error) {
            console.error("加入購物車失敗:", error);
        }
    }
    return (
        <>
            <div className="container my-5">
                {
                    loading &&
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">載入中...</span>
                    </div>
                }
                {
                    error &&
                    <div className="alert alert-danger" role="alert">
                        發生錯誤: {error.message}
                    </div>
                }
                {
                    !loading && !error && (<>
                        {products.filter(product => product.id === id).map(filteredProduct => (
                            <>
                            <div className="row border border-danger" key={filteredProduct.id}>
                                <div className="col-md-4">
                                    <img src={filteredProduct.imageUrl} className="p-3" alt={filteredProduct.title} />
                                </div>
                                <div className="col-md-8 p-3">
                                    <h5 className="card-title">{filteredProduct.title}</h5>
                                    {filteredProduct.description && (
                                    <p className="card-text text-start">{filteredProduct.description.split('\n').map((line, index) => (
                                        <span key={index}>{line}<br /></span>
                                    ))}</p>
                                    )}
                                    {filteredProduct.content && (
                                    <p className="card-text text-start">{filteredProduct.content.split('\n').map((line, index) => (
                                        <span key={index}>{line}<br /></span>
                                    ))}</p>
                                    )}
                                    {filteredProduct.features && (
                                    <p className="card-text text-start">{filteredProduct.features.split('\n').map((line, index) => (
                                        <span key={index}>{line}<br /></span>
                                    ))}</p>
                                    )}
                                    {filteredProduct.specifications && (
                                    <p className="card-text text-start">{filteredProduct.specifications.split('\n').map((line, index) => (
                                        <span key={index}>{line}<br /></span>
                                    ))}</p>
                                    )}
                                    <p className="card-text"><strong>價格:</strong> {filteredProduct.price} 元</p>
                                    <p className="card-text"><small className="text-muted">單位: {filteredProduct.unit}</small></p>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => addCart(filteredProduct.id, 1)}
                                    >
                                        加入購物車
                                    </button>
                                </div>
                            </div>
                            {/* <div className="card" key={filteredProduct.id} style={{width:"18rem"}}>
                                <img src={filteredProduct.imageUrl} className="card-img-top" alt={filteredProduct.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{filteredProduct.title}</h5>
                                    <p className="card-text">{filteredProduct.description}</p>
                                    <p className="card-text"><strong>價格:</strong> {filteredProduct.price} 元</p>
                                    <p className="card-text"><small className="text-muted">單位: {filteredProduct.unit}</small></p>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => addCart(filteredProduct.id, 1)}
                                    >
                                        加入購物車
                                    </button>
                                </div>
                            </div> */}
                        </>))}
                    </>)
                }
            </div>
        </>
    )
}

export default SingleProduct;