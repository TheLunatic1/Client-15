import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/index.ts';
import FindAPro from '../pages/FindAPro/index.ts';
import Categories from '../pages/Categories/index.ts';
import ListYourBusiness from '../pages/ListYourBusiness/index.ts';
import Contact from '../pages/Contact/index.ts';
import Login from '../pages/Login/index.ts';
import JoinNow from '../pages/JoinNow/index.ts';
import AdminDashboard from '../pages/Admin/index.ts';
import UserDashboard from '../pages/UserDashboard/index.tsx';
import TradieDashboard from '../pages/TradieDashboard/index.ts';
import { BlogPage, BlogDetails } from '../pages/Blog/index.ts';
import BusinessProfile from '../pages/FindAPro/BusinessProfile.tsx';
import Terms from '../pages/Terms/index.ts';
import Privacy from '../pages/Privacy/index.ts';
import Giveaway from '../pages/Giveaway/index.ts';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/find-a-pro" element={<FindAPro />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/list-your-business" element={<ListYourBusiness />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join-now" element={<JoinNow />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/business/:id" element={<BusinessProfile />} />
      <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
      <Route path="/user-dashboard" element={<ProtectedRoute element={<UserDashboard />} requiredRole="user" />} />
      <Route path="/tradie-dashboard" element={<ProtectedRoute element={<TradieDashboard />} requiredRole="tradie" />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/giveaway" element={<Giveaway />} />
    </Routes>
  );
};

export default AppRoutes;