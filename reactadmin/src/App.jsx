import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Staff from './pages/Staff';
import Customer from './pages/Customer';
import Category from './pages/Category';
import Product from './pages/Product';
import Subscription from './pages/Subscription';
import ReactDemo from './pages/ReactDemo';

// user pages
import UserLogin from './pages/UserLogin';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Register from './pages/Register';
import CategoryDetail from './pages/CategoryDetail';
import SubscriptionDashboard from './pages/SubscriptionDashboard';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('staffToken');
    return isLoggedIn ? children : <Navigate to="/login" />;
};

const PrivateUserRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('customerToken');
    return isLoggedIn ? children : <Navigate to="/user/login" />;
};

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/staff" element={<PrivateRoute><Staff /></PrivateRoute>} />
                    <Route path="/customer" element={<PrivateRoute><Customer /></PrivateRoute>} />
                    <Route path="/category" element={<PrivateRoute><Category /></PrivateRoute>} />
                    <Route path="/product" element={<PrivateRoute><Product /></PrivateRoute>} />
                    <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
                    <Route path="/react-demo" element={<ReactDemo />} />
                    {/* user routes */}
                    <Route path="/user/login" element={<UserLogin />} />
                    <Route path="/user/register" element={<Register />} />
                    <Route path="/dashboard" element={<PrivateUserRoute><Dashboard /></PrivateUserRoute>} />
                    <Route path="/products" element={<Navigate to="/categories" />} />
                    <Route path="/categories" element={<PrivateUserRoute><Categories /></PrivateUserRoute>} />
                    <Route path="/categories/:name" element={<PrivateUserRoute><CategoryDetail /></PrivateUserRoute>} />
                    <Route path="/subscriptions" element={<PrivateUserRoute><SubscriptionDashboard /></PrivateUserRoute>} />
                    <Route path="/cart" element={<PrivateUserRoute><Cart /></PrivateUserRoute>} />
                    <Route path="/checkout" element={<PrivateUserRoute><Checkout /></PrivateUserRoute>} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
