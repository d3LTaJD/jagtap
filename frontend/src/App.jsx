import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Verify from './pages/Verify';
import SetPassword from './pages/SetPassword';
import AdminUsers from './pages/AdminUsers';
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/Enquiries';
import EnquiryDetail from './pages/EnquiryDetail';
import Quotations from './pages/Quotations';
import QuotationDetail from './pages/QuotationDetail';
import Qaps from './pages/Qaps';
import QapDetail from './pages/QapDetail';
import LandingPage from './pages/LandingPage';
import ProfileSettings from './pages/ProfileSettings';
import FieldBuilder from './pages/FieldBuilder';
import RoleBuilder from './pages/RoleBuilder';
import Customers from './pages/Customers';
import Tasks from './pages/Tasks';
import Gallery from './pages/Gallery';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/set-password" element={<SetPassword />} />
        
        {/* Protected Routes wrapped in DashboardLayout */}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="enquiries/:id" element={<EnquiryDetail />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="quotations/:id" element={<QuotationDetail />} />
          <Route path="qaps" element={<Qaps />} />
          <Route path="qaps/:id" element={<QapDetail />} />
          <Route path="admin" element={<AdminUsers />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="field-builder" element={<FieldBuilder />} />
          <Route path="role-builder" element={<RoleBuilder />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="customers" element={<Customers />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
