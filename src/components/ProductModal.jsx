import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useMessage from "../hooks/useMessage";
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
const VITE_API_PATH = import.meta.env.VITE_API_PATH;


function ProductModal({
    modalType,
    templateProduct,
    getProducts,
    currentPage,
    closeProductModal,
}) {
    const [templateData, setTemplateData] = useState(templateProduct);
    const { showMessage, showError } = useMessage();
    // 同步 templateProduct 到 templateData
    useEffect(() => {
        setTemplateData(templateProduct);
    }, [templateProduct]);
    // 處理輸入框變更
    const handleModelInputChange = (e) => {
        const { id, value, checked, type } = e.target;
        setTemplateData((prevProduct) => ({
        ...prevProduct,
        [id]: type === "checkbox" ? checked : value,
        }));
    };

    // 處理多圖片輸入框變更
    const handleModelImageChange = (index, value) => {
        setTemplateData((prevProduct) => {
        const newImages = [...prevProduct.imagesUrl];
        newImages[index] = value;

        // 填寫最後一個空輸入框時，自動新增空白輸入框
        if (
        value !== "" &&
        index === newImages.length - 1 &&
        newImages.length < 5
        ) {
        newImages.push("");
        }

        // 清空輸入框時，移除最後的空白輸入框
        if (
            value === "" &&
            newImages.length > 1 &&
            newImages[newImages.length - 1] === ""
        ) {
        newImages.pop();
        }

        return {
            ...prevProduct,
            imagesUrl: newImages,
        };
        });
    };

    // 新增圖片輸入框
    const handleAddImage = () => {
        setTemplateData((pre) => {
        const newImage = [...pre.imagesUrl];
        if (newImage.length < 5) {
            newImage.push("");
        }
        return {
            ...pre,
            imagesUrl: newImage,
        };
        })
    };

    // 刪除圖片輸入框
    const handleRemoveImage = () => {
        setTemplateData((pre) => {
        const newImage = [...pre.imagesUrl];
        newImage.pop();
        // if (newImage.length > 1) {
        //   newImage.splice(index, 1);
        // }
        return {
            ...pre,
            imagesUrl: newImage,
        };
        })
    };

    // 更新產品
    const updateProduct = async (id) => {
        let url = `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product`;
        let method = "post";
        if (modalType === "edit") {
        url = `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${id}`;
        method = "put";
        }

        // 整理產品資料
        const productData = {
        data: {
            ...templateData,
            origin_price: Number(templateData.origin_price),
            price: Number(templateData.price),
            is_enabled: templateData.is_enabled ? 1 : 0,
            // 防止 imagesUrl 為空陣列
            imagesUrl: [...templateData.imagesUrl.filter((url) => url !== "")],
        }
        }

        try {
        // [method] 動態設定 axios 方法
        const response = await axios[method](url, productData);
        // alert("產品更新成功");
        // dispatch(createAsyncMessage(response.data));
        showMessage(response.data.message);
        getProducts(currentPage || 1);
        closeProductModal();
        } catch (error) {
        // alert("產品更新失敗: " + error.response.data.message);
        showError(error.response.data.message);
        }
    };

    // 刪除產品
    const deleteProduct = async (id) => {
        try {
        const response = await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${id}`);
        showMessage(response.data.message);
        getProducts(currentPage || 1);
        closeProductModal();
        } catch (error) {
        showError(error.response.data.message);
        }
    };

    // 上傳圖片
    const uploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
        const formData = new FormData();
        formData.append("file-to-upload", file);
        const response = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/upload`, formData);
        setTemplateData((pre) => ({
            ...pre,
            imageUrl: response.data.imageUrl,
        }))
        } catch (error) {
        showError(error.response.data.message);
        }
    };

    const categoryOptions = {
        "成品": ["蝴蝶結"],
        "材料": ["帶子", "夾子", "貼片"],
    };

    return (
        <>
        <div
            id="productModal"
            className="modal fade"
            tabIndex="-1"
            aria-labelledby="productModalLabel"
            aria-hidden="true"
            >
            <div className="modal-dialog modal-xl">
            <div className="modal-content border-0">
                <div className={`modal-header bg-${modalType === 'delete' ? 'danger' : 'dark'} text-white`}>
                <h5 id="productModalLabel" className="modal-title">
                    <span>{modalType === 'delete' ? '刪除' :
                    modalType === 'edit' ? '編輯' : '新增'}產品</span>
                </h5>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ></button>
                </div>
                {
                modalType === 'delete' ? (
                    <div className="modal-body">
                        <p>是否刪除
                        <span className="text-danger">
                            <strong>{templateData.title}</strong>
                        </span> 產品？</p>
                    </div>
                ) : (
                    <div className="modal-body">
                    <div className="row">
                    <div className="col-sm-4">
                        <div className="mb-3">
                            <label htmlFor="fileUpload" className="form-label">
                            上傳圖片
                            </label>
                            <input
                            className="form-control"
                            type="file"
                            name="fileUpload"
                            id="fileUpload"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => uploadImage(e)}
                            />
                        </div>
                        <div className="mb-2">
                        <label htmlFor="imageUrl" className="form-label">
                            輸入主要圖片網址
                        </label>
                        <input
                            id="imageUrl"
                            type="url"
                            className="form-control"
                            placeholder="請輸入圖片網址"
                            value={templateData.imageUrl}
                            onChange={(e) => handleModelInputChange(e)}
                        />
                        {
                            templateData.imageUrl &&
                            <img src={templateData.imageUrl} alt="主要圖片" className="img-fluid" />
                        }
                        </div>
                        <div className="mb-2">
                        {
                            templateData.imagesUrl.map((url, index) => (
                            <div key={index} className="mb-3">
                                <label htmlFor="imageUrl" className="form-label">
                                輸入圖片網址
                                </label>
                                <input
                                type="url"
                                className="form-control"
                                placeholder={`請輸入圖片網址 ${index + 1}`}
                                value={url}
                                onChange={(e) => handleModelImageChange(index, e.target.value)}
                                />
                                {
                                url && (
                                    <img
                                    className="img-fluid"
                                    src={url}
                                    alt={`副圖${index + 1}`}
                                    />
                                )
                                }
                            </div>
                            ))
                        }
                        </div>
                        <div>
                        {
                            templateData.imagesUrl.length < 5 &&
                            templateData.imagesUrl[templateData.imagesUrl.length - 1] !== "" &&
                            <button className="btn btn-outline-primary btn-sm d-block w-100" onClick={() => handleAddImage()}>
                            新增圖片
                            </button>
                        }
                        </div>
                        <div>
                        {
                            templateData.imagesUrl.length >= 1 &&
                            <button className="btn btn-outline-danger btn-sm d-block w-100" onClick={() => handleRemoveImage()}>
                            刪除圖片
                            </button>
                        }
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="mb-3">
                        <label htmlFor="title" className="form-label">標題</label>
                        <input
                            id="title"
                            type="text"
                            className="form-control"
                            placeholder="請輸入標題"
                            value={templateData.title}
                            onChange={(e) => handleModelInputChange(e)}
                            />
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <select
                                id="parentCategory"
                                name="parentCategory"
                                className="form-select"
                                value={templateData.parentCategory}
                                onChange={(e) => handleModelInputChange(e)}
                                >
                                <option value="">請選擇父分類</option>
                                {Object.keys(categoryOptions).map((parent) => (
                                    <option key={parent} value={parent}>{parent}</option>
                                ))}
                                </select>
                            </div>
                            <div className="mb-3 col-md-6">
                                <select
                                id="category"
                                name="category"
                                className="form-select"
                                value={templateData.category}
                                onChange={(e) => handleModelInputChange(e)}
                                disabled={!templateData.parentCategory}
                                >
                                <option value="">請選擇子分類</option>
                                {(categoryOptions[templateData.parentCategory] || []).map((cate) => (
                                    <option key={cate} value={cate}>{cate}</option>
                                ))}
                                </select>
                                {/* <label htmlFor="category" className="form-label">分類</label>
                                <input
                                id="category"
                                type="text"
                                className="form-control"
                                placeholder="請輸入分類"
                                value={templateData.category}
                                onChange={(e) => handleModelInputChange(e)}
                                /> */}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-3 col-md-4">
                                <label htmlFor="origin_price" className="form-label">原價</label>
                                <input
                                id="origin_price"
                                type="number"
                                min="0"
                                className="form-control"
                                placeholder="請輸入原價"
                                value={templateData.origin_price}
                                onChange={(e) => handleModelInputChange(e)}
                                />
                            </div>
                            <div className="mb-3 col-md-4">
                                <label htmlFor="price" className="form-label">售價</label>
                                <input
                                id="price"
                                type="number"
                                min="0"
                                className="form-control"
                                placeholder="請輸入售價"
                                value={templateData.price}
                                onChange={(e) => handleModelInputChange(e)}
                                />
                            </div>
                            <div className="mb-3 col-md-4">
                                <label htmlFor="unit" className="form-label">單位</label>
                                <input
                                id="unit"
                                type="text"
                                className="form-control"
                                placeholder="請輸入單位"
                                value={templateData.unit}
                                onChange={(e) => handleModelInputChange(e)}
                                />
                            </div>
                        </div>
                        <hr />

                        <div className="mb-3">
                        <label htmlFor="description" className="form-label">產品描述</label>
                        <textarea
                            id="description"
                            className="form-control"
                            placeholder="請輸入產品描述"
                            value={templateData.description}
                            onChange={(e) => handleModelInputChange(e)}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                        <label htmlFor="content" className="form-label">說明內容</label>
                        <textarea
                            id="content"
                            className="form-control"
                            placeholder="請輸入說明內容"
                            value={templateData.content}
                            onChange={(e) => handleModelInputChange(e)}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <div className="form-check">
                                <input
                                id="is_enabled"
                                className="form-check-input"
                                type="checkbox"
                                checked={Boolean(templateData.is_enabled)}
                                onChange={(e) => handleModelInputChange(e)}
                                />
                                <label className="form-check-label" htmlFor="is_enabled">
                                是否啟用
                                </label>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                )
                }
                <div className="modal-footer">
                {
                    modalType === 'delete' ? (
                    <div className="modal-footer">
                        <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => deleteProduct(templateData.id)}
                        >
                        刪除
                        </button>
                    </div>
                    ) : (
                    <>
                        <button
                        type="button"
                        className="btn btn-outline-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => closeProductModal()}
                        >
                        取消
                        </button>
                        <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => updateProduct(templateData.id)}>
                            確認
                        </button>
                    </>
                    )
                }

                </div>
            </div>
            </div>
        </div>
        </>
    )
}

export default ProductModal;