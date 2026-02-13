import { useState } from "react";
import axios from 'axios'
import { useForm } from "react-hook-form";
import { emailValidation } from "../utils/validation";
import { useNavigate } from "react-router";
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
const VITE_API_PATH = import.meta.env.VITE_API_PATH;

function Login( getProducts, setIsAuth ) {
    // const [formData, setFormData] = useState({
    //     username: "",
    //     password: "",
    // });
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            username: "",
            password: "",
        }
    });

    // const handleInputChange = (e) => {
    //     const { id, value } = e.target;
    //     setFormData((prevData) => ({
    //     ...prevData,
    //     [id]: value,
    //     }));
    // };

    const onSubmit = async (formData) => {
        try {
        const response = await axios.post(`${VITE_API_BASE}/admin/signin`, formData);
        console.log("登入成功:", response.data);
        const { token, expired } = response.data;
        document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
        axios.defaults.headers.common.Authorization = token;
        // getProducts();
        // setIsAuth(true);
        // alert("登入成功: " + response.data.message);
        navigate("/admin/product");
        } catch (error) {
        // setIsAuth(false);message);
        alert("登入失敗: " + (error.response?.data?.message || error.message));
        }
    };

    return (<>
    <div className="container login">
        <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
            <form id="form" className="form-signin" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-floating mb-3">
                <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                {...register("username", emailValidation)}
                // value={formData.username}
                // onChange={handleInputChange}
                // required
                // autoFocus
                />
                <label htmlFor="username">Email address</label>
                {errors.username && (
                <div className="text-danger mt-1">{errors.username.message}</div>
                )}
            </div>
            <div className="form-floating">
                <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                // value={formData.password}
                // onChange={handleInputChange}
                // required
                {...register("password", {
                    required: "請輸入密碼",
                    minLength: {
                        value: 6,
                        message: "密碼長度至少需 6 碼",
                    },
                    })}
                />
                <label htmlFor="password">Password</label>
                {errors.password && (
                <div className="text-danger mt-1">{errors.password.message}</div>
                )}
            </div>
            <button
                className="btn btn-lg btn-primary w-100 mt-3"
                type="submit"
                disabled={!isValid}
                >
                登入
            </button>
            </form>
        </div>
        </div>
        <p className="mt-5 mb-3 text-muted">&copy; 2026~∞ - 愛哆啦也愛手作</p>
    </div>
    </>)
}

export default Login;