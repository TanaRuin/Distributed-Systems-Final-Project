import axios from "axios";
import { getHttp } from "./http";

export const login = async (email, pass) => {
    try {
        const resp = await axios.post(
            getHttp() + "/api/auth/login", 
            {email, password: pass}
        );

        return {
            success: resp.data.success,
            user: resp.data.user,
            message: resp.data.message || "Login success",
        };
    } catch (error) {
        console.error("Login error:", error);
        const message = error.response?.data?.message || "Login failed. Please try again.";

        return {success: false, message};
    }
};

export const logout = async() => {
    localStorage.removeItem("user");
    return await axios.post(
        getHttp() + "/api/auth/logout",
    );
}

export const register = async(name, email, pass) => {
    try {
        const resp = await axios.post(
            getHttp() + "/api/auth/register",
            {name: name, email: email, password: pass},
        );

        return {
            success: resp.data.success,
            user: resp.data.user,
            message: resp.data.message || "Register success",
        };
    } catch (error) {
        console.error("Register error:", error);
        const message = error.response?.data?.message || "Register failed. Please try again.";

        return {success: false, message};
    }
}

export const getUserById = async(userId) => {
    try {
        const resp = await axios.get(
            getHttp() + "/api/auth/user?userId=" + userId,
        );

        return {
            success: resp.data.success,
            user: resp.data.user,
            message: resp.data.message || "Get user by id success",
        };
    } catch (error) {
        console.error("Get user by id error:", error);
        const message = error.response?.data?.message || "Get user by id failed. Please try again.";

        return {success: false, message};
    }
}

export const setAuth = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
}

export const getUserData = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};


export const isAuth = () => {
    const user = localStorage.getItem("user");
    if (!user) return false;
    return true;
}