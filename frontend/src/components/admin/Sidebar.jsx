// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { Home, ShoppingCart, Package, Bell, PackagePlus, BarChart, Percent, LifeBuoy, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { logout } from "../../store/userReducer";

const sidebarLinks = [
  { name: "Dashboard", to: "/admin", icon: <Home className="w-5 h-5" /> },
  { name: "Create", to: "/admin/create", icon: <PackagePlus className="w-5 h-5" /> },
  { name: "Products", to: "/admin/products", icon: <Package className="w-5 h-5" /> },
  { name: "Orders", to: "/admin/orders", icon: <ShoppingCart className="w-5 h-5" /> },
  { name: "Notifications", to: "/admin/notifications", icon: <Bell className="w-5 h-5" /> },
  // { name: "Customers", to: "/admin/customers", icon: <Users className="w-5 h-5" /> },
  // { name: "Reports", to: "/admin/reports", icon: <BarChart className="w-5 h-5" /> },
  // { name: "Discounts", to: "/admin/discounts", icon: <Percent className="w-5 h-5" /> },
  // { name: "Help", to: "/admin/help", icon: <LifeBuoy className="w-5 h-5" /> },
  // { name: "Settings", to: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-64 h-screen border-r bg-white shadow-sm p-4 flex flex-col sticky top-0 "
    >
      <div className="text-2xl font-bold px-4 py-2 mb-4">SnapBuy</div>

      <nav className="flex flex-col gap-1">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin"} // 👈 only add `end` to `/admin`
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-colors hover:bg-muted ${isActive ? "bg-muted font-medium text-primary" : "text-muted-foreground"
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4">
        <Button variant="outline" className="w-full"
          onClick={async (e) => {
            e.preventDefault();
            try {
              await dispatch(logout()).unwrap(); 
              navigate('/login');
            } catch (error) {
              toast.error(error?.message || 'Logout failed');
            }
          }}
        >
          Logout
        </Button>
      </div>
    </motion.aside>
  );
}
