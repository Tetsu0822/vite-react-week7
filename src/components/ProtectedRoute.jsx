import axios from 'axios'
import { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';

const VITE_API_BASE = import.meta.env.VITE_API_BASE;
const VITE_API_PATH = import.meta.env.VITE_API_PATH;

function ProtectedRoute({ children }) {
    const [isAuth, setIsAuth] = useState(false);
    const [ isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
        );
        axios.defaults.headers.common.Authorization = token;

        const checkLogin = async () => {
            try {
            await axios.post(`${VITE_API_BASE}/api/user/check`);
            setIsAuth(true);
            } catch (err) {
            setIsAuth(false);
            console.log(err.response.data.message);
            } finally {
                setIsLoading(false);
            }
        };

        checkLogin();

    }, []);

    if (isLoading) return <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
    />;
    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;