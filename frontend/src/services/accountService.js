import { getToken } from "@/utils/auth";
import axios from "@/lib/axios";

function authConfig() {
    return {
        headers: {
            Authorization: getToken()
        }
    };
}

export async function getAccounts() {
    const response = await axios.get(
        "/accounts",
        authConfig()
    );

    return response.data;
}

export async function getAccountCodes() {
    const response = await axios.get(
        "/accounts/codes",
        authConfig()
    );

    return response.data;
}

export async function getAccountById(id) {
    const response = await axios.get(
        `/accounts/${id}`,
        authConfig()
    );

    return response.data;
}

export async function addAccount(data) {
    const response = await axios.post(
        "/accounts",
        data,
        authConfig()
    );

    return response.data;
}

export async function updateAccount(id, data) {
    const response = await axios.put(
        `/accounts/${id}`,
        data,
        authConfig()
    );

    return response.data;
}

export async function deleteAccount(id) {
    const response = await axios.delete(
        `/accounts/${id}`,
        authConfig()
    );

    return response.data;
}

export async function getQrCode(id) {
    const response = await axios.get(
        `/accounts/${id}/qrcode`,
        authConfig()
    );

    return response.data;
}

export async function verifyOtp(id, token) {
    const response = await axios.post(
        `/accounts/${id}/verify`,
        { token },
        authConfig()
    );

    return response.data;
}

export async function verifyRecoveryCode(id, code) {
    const response = await axios.post(
        `/accounts/${id}/recovery`,
        { code },
        authConfig()
    );

    return response.data;
}