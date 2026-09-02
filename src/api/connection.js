import axios from 'axios';
import routes from './routes';
import useAuth from '../store/userStore';
import { useNavigate } from 'react-router-dom';


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    withCredentials: true,
});

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const navigate = useNavigate();
//         const { isLoggedIn } = useAuth.getState();

//         // Scenario A: Block the request entirely if not logged in
//         if (!isLoggedIn && !config.url.includes('/login')) {
//             navigate('/login');
//             return Promise.reject(new Error('User is not authenticated. Request cancelled.'));
//         }

//         // Scenario B: Attach a custom header flag if logged in
//         if (isLoggedIn) {
//             config.headers['X-User-Authenticated'] = 'true';
//         }

//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export async function signup(payload) {
    let res;
    try {
        res = await axiosInstance.post(routes.signup, payload);
        return res.data;
    } catch (error) {
        return res.data.data.message;
    }
}

export async function login(payload) {
    let res;
    try {
        res = await axiosInstance.post(routes.login, payload);
        return res.data;
    } catch (error) {
        return res.data.data.message;
    }
}

export async function logout() {
    const setIsLoggedIn = useAuth(state => state.setIsLoggedIn);
    const setUser = useAuth(state => state.setUser);

    let res;
    try {
        res = await axiosInstance.post(routes.logout);
        if (res.data.success) {
            setUser(null);
            setIsLoggedIn(false);
        }
    } catch (error) {
        return res.data.data.message;
        console.error('Logout failed', error);
    }
}

export async function getUser() {
    let res;
    try {
        res = await axiosInstance.get(routes.getUser);
        if(res.data.success) {
            return res.data;
        }
    } catch (error) {
        return res.data.message;
    }
}

export async function getUserByUsername(username) {
    let res;
    try {
        res = await axiosInstance.get(`${routes.getUser}/${username}`);
        if(res.data.success) {
            return res.data;
        }
    } catch (error) {
        return res.data.message;
    }
}