import axios from "@/lib/axios";
import { getToken } from "@/utils/auth";

async function registerUser(data) {
    const response = await axios.post(
        "/auth/register",
        data
    );

    return response.data;
}

async function loginUser(data) {
    const response = await axios.post(
        "/auth/login",
        data
    );

    return response.data;
}

async function getMe() {
    const authToken = getToken()
    const response = await axios.get(
        "/auth/me",
        {
            headers: {
                Authorization: authToken
            }
        }
    );

    return response.data;
}

export {
    registerUser,
    loginUser,
    getMe
};
