import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardHome from "./components/common/admin/DashboardHome";
import CreateProduct from "./components/common/admin/CreateProduct";
import Products from "./components/common/admin/Products";
import Orders from "./components/common/admin/Orders";
import Loader from "./components/common/Loader";

import { Toaster } from "react-hot-toast";
import { getProfile } from "./store/userReducer";


function AppRoutes() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated, user, isLoading } = useSelector(state => state.auth);


    useEffect(() => {
        dispatch(getProfile());
    }, []);

    if (isLoading) return <Loader />;

    return (
        <>
            {/* Conditionally show navbar */}
            {!location.pathname.startsWith("/admin") && <Navbar user={user} />}

            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route
                    path="/login"
                    element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
                />
                <Route
                    path="/register"
                    element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
                />

                {/* Protected admin routes */}
                <Route
                    path="/admin"
                    element={
                        isAuthenticated && user?.role === 'admin' ? (
                            <AdminDashboard />
                        ) : (
                            <Navigate to="/login" state={{ from: location }} replace />
                        )
                    }
                >
                    <Route index element={<DashboardHome />} />
                    <Route path="create" element={<CreateProduct />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
            <Toaster position="top-right" reverseOrder={false} />
        </BrowserRouter>
    );
}

export default App;