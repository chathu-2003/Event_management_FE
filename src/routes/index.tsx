import {lazy, Suspense} from "react";
import type { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Index = lazy(() => import("../pages"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Bookings = lazy(() => import("../pages/Bookingspage"));
const Contact = lazy(() => import("../pages/Contact"));
const Events = lazy(() => import("../pages/Events"));
const Reviews = lazy(() => import("../pages/Reviews"));
const AdminDashboard = lazy(() => import("../pages/admin-dashboard"));
const AdminEvents = lazy(() => import("../pages/AdminEvents"));
const AdminBookings = lazy(() => import("../pages/AdminBookings"));
const AdminUsers = lazy(() => import("../pages/AdminUsers"));
const AdminReviews = lazy(() => import("../pages/AdminReviews"));
const MyBookings = lazy(() => import("../pages/MyBookings"));

// Private route guard for logged-in users
const PrivateRoute = ({ element }: { element: ReactElement }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? element : <Navigate to="/login" replace />;
};

// Simple role-based guard for admin routes
const AdminRoute = ({ element }: { element: ReactElement }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return user?.roles?.includes("ADMIN") ? element : <Navigate to="/login" replace />;
};



export default function Router() {
    return (
   <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/my-bookings" element={<PrivateRoute element={<MyBookings />} />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
          <Route path="/admin/events" element={<AdminRoute element={<AdminEvents />} />} />
          <Route path="/admin/bookings" element={<AdminRoute element={<AdminBookings />} />} />
          <Route path="/admin/users" element={<AdminRoute element={<AdminUsers />} />} />
          <Route path="/admin/reviews" element={<AdminRoute element={<AdminReviews />} />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    );
}