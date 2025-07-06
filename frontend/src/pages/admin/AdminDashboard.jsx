import Sidebar from '../../components/common/admin/Sidebar'
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  
  return (
   <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 ">
      {/* Sidebar with fixed width */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
