import useProducts from "../../hooks/useProducts";
import ProductCard from "../../components/ProductCard";
import { useNavigate } from "react-router";

function Home() {
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
                <h2>最新上架</h2>
            <ProductCard products={products.slice(0, 6)} handleViewMore={handleViewMore} />
            </div>
        )}
        </>
    )
}

export default Home;