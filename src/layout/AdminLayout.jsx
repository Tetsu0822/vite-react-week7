import { Outlet, Link, useNavigate } from "react-router";
import logo from "../assets/images/Handmade_Bow.png";
import axios from "axios";

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        delete axios.defaults.headers.common.Authorization;
        navigate("/login");
    }
    return (
        <>
        <header>
            <ul className="nav">
                <li className="nav-item align-items-center">
                    <Link className="nav-link" to="/admin/product">
                        <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-text-bottom me-2" />
                        <span style={{ color: "#000", fontSize: "20px", fontWeight: "bold" }}>愛哆啦也愛手作</span>
                    </Link>
                </li>
                <li className="nav-item align-items-center">
                    <button
                        className="btn btn-outline-primary btn-sm mt-2"
                        onClick={handleLogout}
                    >
                        登出
                    </button>
                </li>
            </ul>
        </header>
        <div className="row">
            <aside style={{ width: "200px", backgroundColor: "#f0f0f0", padding: "20px" }}>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/product">產品管理</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/order">訂單管理</Link>
                    </li>
                </ul>
            </aside>
            <main style={{ flex: 1, padding: "20px" }}>
                <Outlet />
            </main>
        </div>
        <footer style={{ backgroundColor: "#333", color: "#fff", textAlign: "center", padding: "10px" }}>
            版權所有 &copy; 2025
        </footer>
        </>
    );
}

export default AdminLayout;