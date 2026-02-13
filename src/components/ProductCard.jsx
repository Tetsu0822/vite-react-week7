function ProductCard({ products, handleViewMore }) {
    return (
        <>
        <div className="container mt-4">
            <div className="row">
                {products.map((product) => (
                <div className="col-md-4 mb-3" key={product.id}>
                    <div className="card">
                    <img
                        src={product.imageUrl}
                        className="card-img-top"
                        alt={product.title}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-text">
                        {product.description}
                        </p>
                        <p className="card-text">
                        <strong>價格:</strong> {product.price} 元
                        </p>
                        <p className="card-text">
                        <small className="text-muted">單位: {product.unit}</small>
                        </p>
                        <button
                        className="btn btn-primary"
                        onClick={() => handleViewMore(product.id)}
                        >
                        查看更多
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </>
    );
}

export default ProductCard;