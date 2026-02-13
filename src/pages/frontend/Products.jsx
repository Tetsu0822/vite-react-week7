import useProducts from "../../hooks/useProducts";
import ProductCard from "../../components/ProductCard";
import { useNavigate } from "react-router";

function Products() {
    const { products, loading, error } = useProducts();
    const navigate = useNavigate();
    const handleViewMore = (id) => {
        navigate(`/product/${id}`);
    };
    return (
        <>
        {loading ? (
            <p>Loading...</p>
        ) : error ? (
            <p>Error: {error.message}</p>
        ) : (
            <div className="container">
                <h2>產品列表</h2>
            <ProductCard products={products} handleViewMore={handleViewMore} />
            </div>
        )}
        </>
    )
}

export default Products;