import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import DashboardLayout from "../components/DashboardLayout";
import VaultPage from "../pages/VaultPage";
import SharedLinksPage from "../pages/SharedLinksPage";
import SettingsPage from "../pages/SettingsPage";
import LoginPage from "../pages/LoginPage";
import PublicViewPage from "../pages/PublicViewPage";

const ProtectedRoute = () => {
    const { state } = useAuthContext();

    if (state.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!state.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
};

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/share/:token",
        element: <PublicViewPage />,
    },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                index: true,
                element: <VaultPage />,
            },
            {
                path: "vault",
                element: <VaultPage />,
            },
            {
                path: "shared",
                element: <SharedLinksPage />,
            },
            {
                path: "settings",
                element: <SettingsPage />,
            },
        ],
    },
]);
