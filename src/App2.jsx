import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import * as bootstrap from "bootstrap";
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';
import Login from './pages/Login';
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
const VITE_API_PATH = import.meta.env.VITE_API_PATH;
const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  parentCategory: "",
};

function App() {

  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [ modalType, setModalType ] = useState(""); // 'create', 'edit', 'delete'
  const [ pagination, setPagination ] = useState({});
  const [currentPage, setCurrentPage] = useState(1);// 目前頁碼
  const productModalRef = useRef(null);

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
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

    checkAdmin();

  }, []);

  const openProductModal = (type, product) => {
    setModalType(type);
    setTemplateProduct(() => ({
      ...INITIAL_TEMPLATE_DATA,
      ...product,
      imagesUrl: (product.imagesUrl && product.imagesUrl.length > 0) ? product.imagesUrl : [""],
    }));
    productModalRef.current.show();
  };

  const closeProductModal = () => {
    productModalRef.current.hide();
  };

  const checkAdmin = async () => {
    try {
      await axios.post(`${VITE_API_BASE}/api/user/check`);
      setIsAuth(true);
    } catch (err) {
      setIsAuth(false);
      console.log(err.response.data.message);
    }
  };



  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (err) {
      alert("無法取得產品列表" + err.response.data.message);
    }
  }



  // 取得產品列表
  useEffect(() => {
    if (isAuth) {
      getProducts();
    }
  }, [isAuth]);

  return (
    <>
      {isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button
                className="btn btn-primary"
                onClick={() => openProductModal("create", INITIAL_TEMPLATE_DATA)}>
                  建立新的產品
              </button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">父分類</th>
                  <th width="120">子分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.parentCategory}</td>
                  <td>{item.category}</td>
                  <td>{item.title}</td>
                  <td className="text-end">{item.origin_price}</td>
                  <td className="text-end">{item.price}</td>
                  <td>
                    {item.is_enabled ? (
                      <span className="text-success">啟用</span>
                    ) : (
                      <span>未啟用</span>
                    )}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openProductModal("edit", item)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openProductModal("delete", item)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
            <Pagination pagination={pagination} onPageChange={getProducts} />
          </div>
        </div>
      ) : (
        <Login getProducts={getProducts} setIsAuth={setIsAuth} />
      )}

      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        getProducts={getProducts}
        currentPage={currentPage}
        closeProductModal={closeProductModal}
      />
    </>
  )
}

export default App
