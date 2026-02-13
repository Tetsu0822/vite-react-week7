import { createHashRouter } from "react-router";
import FrontendLayout from "../layout/FrontendLayout";
import Home from "../pages/frontend/Home";
import Products from "../pages/frontend/Products";
import SingleProduct from "../pages/frontend/SingleProduct";
import Cart from "../pages/frontend/Cart";
import NotFound from "../pages/frontend/NotFound";
import Checkout from "../pages/frontend/CheckOut";
import Login from "../pages/Login";
import Utils from "../pages/frontend/Utils";
import AdminLayout from "../layout/AdminLayout";
import AdminProducts from "../pages/backend/AdminProducts";
import AdminOrders from "../pages/backend/AdminOrders";
import ProtectedRoute from "../components/ProtectedRoute";

export const routes = createHashRouter([
    {
        path: "/",
        element: <FrontendLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "product",
                element: <Products />
            },
            {
                path: "product/:id",
                element: <SingleProduct />
            },
            {
                path: "cart",
                element: <Cart />
            },
            {
                path: "checkout",
                element: <Checkout />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "utils",
                element: <Utils />
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    },
    {
        path: "admin",
        element:
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>,
        children: [
            {
                path: "product",
                element: <AdminProducts />
            },
            {
                path: "order",
                element: <AdminOrders />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);