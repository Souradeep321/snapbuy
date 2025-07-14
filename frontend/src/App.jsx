import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


import Home from "./pages/common/HomePage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Loader from "./components/common/Loader";

import { Toaster } from "react-hot-toast";
import { getProfile } from "./store/userReducer";
import Collection from "./pages/common/Collection";
import CartPage from "./pages/common/CartPage";
import Profile from "./pages/common/Profile";
import Navbar from "./components/common/Navbar";
import DashboardHome from "./components/admin/DashboardHome";
import CreateProduct from "./components/admin/CreateProduct";
import ProductList from "./components/admin/Products";
import SingleOrder from "./components/admin/SingleOrder";
import ProductListingPageWrapper from "./pages/common/ProductListingPageWrapper";
import ShowProduct from "./components/common/ShowProduct";
import { useGetCartItemsQuery } from "./store/cartApi";
import Checkout from "./pages/common/Checkout";
import PurchaseSuccess from "./pages/common/PurchaseSuccess";
import About from "./pages/common/About";
import Contact from "./pages/common/Contact";
import Notifications from "./pages/common/Notifications";
import UserOrder from "./pages/common/UserOrder";
import Orders from "./components/admin/Orders";
import Settings from "./pages/common/Settings";
import SearchPage from "./pages/common/SearchPage";
import Footer from "./components/common/Footer";

function AppRoutes() {
    const location = useLocation();
    const dispatch = useDispatch();

    const { isAuthenticated, user, isLoading, authChecked } = useSelector(state => state.auth);

    const { data, isLoading: cartLoading, error } = useGetCartItemsQuery(undefined, {
        skip: !isAuthenticated
    });


    useEffect(() => {
        console.log("🔁 App mounted — dispatching getProfile...");
        dispatch(getProfile());
    }, [dispatch]);

    if (isLoading || !authChecked) return <Loader />;

    return (
        <>
            {!location.pathname.startsWith("/admin") && <Navbar cartItems={data?.data || []}
                isLoading={cartLoading} error={error} />}

            <Routes>
                {/* public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:productId" element={<ShowProduct />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                {/* cart page  */}
                <Route
                    path="/cart"
                    element={
                        <CartPage
                            cartItems={data?.data || []}
                            isLoading={cartLoading}
                            error={error}
                        />
                    }
                />
                {/* checkout */}
                <Route path="/checkout"
                    element={<Checkout
                        cartItems={data?.data || []}
                        isLoading={cartLoading}
                        error={error}
                    />}
                />

                <Route path="/search" element={<SearchPage />} />

                {/* Product Listing Pages */}
                <Route path="/:gender" element={<ProductListingPageWrapper />} />
                <Route path="/:gender" element={<ProductListingPageWrapper />} />
                <Route path="/:gender/:category" element={<ProductListingPageWrapper />} />
                <Route path="/:gender/:category/:subCategory" element={<ProductListingPageWrapper />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/collection/:category" element={<ProductListingPageWrapper />} />
                <Route path="/collection/:category/:subCategory" element={<ProductListingPageWrapper />} />



                {/* Protected Routes */}
                {/* Protected Routes */}
                <Route
                    path="/profile"
                    element={user ? <Profile /> : <Navigate to="/login" state={{ from: location }} replace />}
                >
                    <Route index element={<Settings />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="orders" element={<UserOrder />} />
                    <Route path="orders/:orderId" element={<SingleOrder />} />
                    <Route path="notifications" element={<Notifications />} />
                </Route>



                <Route
                    path="/login"
                    element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
                />
                <Route
                    path="/register"
                    element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
                />


                <Route
                    path="/admin"
                    element={
                        isAuthenticated && user?.role === 'admin'
                            ? <AdminDashboard />
                            : <Navigate to="/login" state={{ from: location }} replace />
                    }
                >
                    <Route index element={<DashboardHome />} />
                    <Route path="create" element={<CreateProduct />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:orderId" element={<SingleOrder />} />
                    <Route path="notifications" element={<Notifications />} />
                </Route>


                {/* customer success page */}
                <Route path="/purchase-success/:orderId" element={user ? <PurchaseSuccess /> : <Navigate to="/login" state={{ from: location }} replace />} />


                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {!location.pathname.startsWith("/admin") && !location.pathname.startsWith("/cart") && !location.pathname.startsWith("/checkout") && !location.pathname.startsWith("/profile") && !location.pathname.startsWith("/login") && !location.pathname.startsWith("/register") && <Footer />}
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
            <Toaster />
        </BrowserRouter>
    );
}

export default App;