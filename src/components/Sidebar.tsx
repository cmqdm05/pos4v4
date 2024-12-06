import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  BarChart2,
  Tag,
  LogOut,
  Boxes,
  Users,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { RootState } from "../store";
import { PERMISSIONS, hasPermission } from "../utils/permissions";
import { useSidebarStore } from "../store/ui/sidebarStore";

interface NavItemProps {
  to: string;
  icon: any;
  children: React.ReactNode;
  permission?: string;
}

const NavItem = ({ to, icon: Icon, children, permission }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const { staff } = useSelector((state: RootState) => state.auth);

  if (permission && staff) {
    if (!hasPermission(staff.role.permissions, permission)) {
      return null;
    }
  }

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
        isActive
          ? "bg-indigo-800 text-white"
          : "text-indigo-100 hover:bg-indigo-800"
      }`}
    >
      <Icon className="mr-3 h-5 w-5" />
      {children}
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const { storeId } = useParams();
  const { staff, user } = useSelector((state: RootState) => state.auth);
  const { isOpen, toggle } = useSidebarStore();

  const handleLogout = () => {
    localStorage.removeItem("selectedStoreId");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("staff");
    dispatch(logout());
  };

  if (staff && storeId !== staff.store) {
    return null;
  }

  const sidebarContent = (
    <div className="flex flex-col flex-grow pt-5 bg-indigo-700 overflow-y-auto">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center flex-shrink-0">
          <Store className="h-8 w-8 text-white" />
          <span className="ml-2 text-white text-lg font-semibold">
            POS System
          </span>
        </div>
        <button
          onClick={toggle}
          className="md:hidden p-2 rounded-md text-indigo-100 hover:bg-indigo-800"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="mt-5 flex-1 flex flex-col">
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {!storeId ? (
            !staff && <NavItem to="/stores" icon={Store}>Stores</NavItem>
          ) : (
            <>
              <NavItem to={`/stores/${storeId}/dashboard`} icon={LayoutDashboard}>
                Dashboard
              </NavItem>
              <NavItem
                to={`/stores/${storeId}/products`}
                icon={Package}
                permission={PERMISSIONS.MANAGE_INVENTORY}
              >
                Products
              </NavItem>
              <NavItem
                to={`/stores/${storeId}/inventory`}
                icon={Boxes}
                permission={PERMISSIONS.MANAGE_INVENTORY}
              >
                Inventory
              </NavItem>
              <NavItem
                to={`/stores/${storeId}/sales`}
                icon={ShoppingCart}
                permission={PERMISSIONS.CREATE_SALE}
              >
                Sales
              </NavItem>
              <NavItem
                to={`/stores/${storeId}/discounts`}
                icon={Tag}
                permission={PERMISSIONS.MANAGE_INVENTORY}
              >
                Discounts
              </NavItem>
              <NavItem
                to={`/stores/${storeId}/reports`}
                icon={BarChart2}
                permission={PERMISSIONS.VIEW_REPORTS}
              >
                Reports
              </NavItem>
              <NavItem
                to={`/stores/${storeId}/users`}
                icon={Users}
                permission={PERMISSIONS.MANAGE_USERS}
              >
                Users
              </NavItem>
              <NavItem
                to={`/stores/${storeId}/settings`}
                icon={Settings}
                permission={PERMISSIONS.MANAGE_SETTINGS}
              >
                Settings
              </NavItem>
              {!staff && (
                <NavItem to="/stores" icon={Store}>
                  Switch Store
                </NavItem>
              )}
            </>
          )}
        </nav>
        <div className="px-2 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-800 rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      {!isOpen && (
        <button
          onClick={toggle}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggle}
        />

        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full">
          {sidebarContent}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;