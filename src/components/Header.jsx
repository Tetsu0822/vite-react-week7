import { Link } from "react-router-dom";
import logo from "../assets/images/Handmade_Bow.png";
const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-text-top me-2" />
                愛哆啦也愛手作</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link className="nav-link" to="/">首頁</Link>
                    <Link className="nav-link" to="/product">產品頁面</Link>
                    <Link className="nav-link" to="/cart">購物車頁面</Link>
                    <Link className="nav-link" to="/checkout">結帳頁面</Link>
                    <Link className="nav-link" to="/login">登入頁面</Link>
                </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;