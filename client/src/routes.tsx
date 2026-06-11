import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./pages/auth/AuthLayout";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import LoginUserPage from "./pages/auth/LoginUserPage";
import CheckPage from "./pages/auth/CheckPage";
import RegisterUser from "./pages/auth/RegisterUserPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserLayout from "./pages/user/UserLayout";
import HomePage from "./pages/user/HomePage";
import BlogPage from "./pages/user/BlogPage";
import DetailItem from "./pages/user/DetailItem";
import CartPage from "./pages/user/CartPage";
import OrderedTablePage from "./pages/user/OrderedTablePage";
import HistoryOrderedPage from "./pages/user/HistoryOrderedPage";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import ManageTablesPage from "./pages/admin/ManageTablesPage";
import ManagerFoods from "./pages/admin/ManagerFoods";
import ManagerStaffs from "./pages/admin/ManagerStaffs";
import ManagerRevenues from "./pages/admin/ManagerRevenues";
import CreateQRPaymentPage from "./pages/admin/CreateQRPaymentPage";
import ChefLayout from "./pages/chef/ChefLayout";
import ReceiveListFood from "./pages/chef/ReceiveListFood";
import ManagerForChef from "./pages/chef/ManagerForChef";
import TableShowAll from "./pages/chef/TableShowAll";
import TableDetailForChef from "./pages/chef/TableDetailForChef";
import DuplicateFood from "./pages/chef/DuplicateFood";
import SortFood from "./pages/chef/SortFood";
import HistoryFood from "./pages/chef/HistoryFood";
import { lazy } from "react";
import ShowTablePage from "./pages/staff/ShowTablePage.tsx";
import StaffLayout from "./pages/staff/StaffLayout.tsx";
import DiscountTicket from "./pages/admin/DiscountTicket.tsx";
import ProtectedRouteRes from "./components/auth/ProtectedRouteRes.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

const MenuPageLazyLoad = lazy(() => import("./pages/user/MenuPage.tsx"));

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/register/admin",
        element: <RegisterPage />,
      },
      {
        path: "/login/admin",
        element: <LoginPage />,
      },
      {
        path: "/login",
        element: <LoginUserPage />,
      },
      {
        path: "/:slug/check",
        element: <CheckPage />,
      },
      {
        path: "/register",
        element: <RegisterUser />,
      },
    ],
  },
  {
    element: <UserLayout />,
    children: [
      {
        element: <HomePage />,
        path: "/",
      },
      {
        element: <ProtectedRoute allowedRoles={["user", "guest"]} />,
        children: [
          {
            element: <MenuPageLazyLoad />,
            path: "/menu",
          },
          {
            element: <DetailItem />,
            path: "/menu/:id",
          },
          {
            element: <CartPage />,
            path: "/cart",
          },
          {
            element: <OrderedTablePage />,
            path: "/ordered/:id",
          },
          {
            element: <HistoryOrderedPage />,
            path: "/ordered",
          },
        ],
      },
      {
        element: <BlogPage />,
        path: "/blog",
      },
    ],
  },
  {
    element: <ProtectedRouteRes allowedRoles={["manager"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            element: <DashboardPage />,
            path: "/dashboard",
          },
          {
            element: <ManageTablesPage />,
            path: "/manage-tables",
          },
          {
            element: <ManagerFoods />,
            path: "/manager-foods",
          },
          {
            element: <ManagerStaffs />,
            path: "/manager-staffs",
          },
          {
            element: <ManagerRevenues />,
            path: "/manager-revenues",
          },
          {
            element: <CreateQRPaymentPage />,
            path: "/createqr-payment",
          },
          {
            element: <DiscountTicket />,
            path: "/discounts",
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRouteRes allowedRoles={["staff"]} />,
    children: [
      {
        element: <StaffLayout />,
        children: [
          {
            element: <ShowTablePage />,
            path: "/staff/show-table",
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRouteRes allowedRoles={["chef", "chef_head"]} />,
    children: [
      {
        element: <ChefLayout />,
        children: [
          {
            element: <ReceiveListFood />,
            path: "/chef/confirm-order",
          },
          {
            element: <ManagerForChef />,
            path: "/chef/manager",
          },
          {
            element: <TableShowAll />,
            path: "/chef/table",
          },
          {
            element: <TableDetailForChef />,
            path: "/chef/table/:id",
          },
          {
            element: <DuplicateFood />,
            path: "/chef/duplicate-food",
          },
          {
            element: <SortFood />,
            path: "/chef/:id/:category",
          },
          {
            element: <HistoryFood />,
            path: "/chef/history-food",
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
