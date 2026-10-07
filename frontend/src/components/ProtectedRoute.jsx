import { getToken } from "@/utils/auth";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
    const token = getToken();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}