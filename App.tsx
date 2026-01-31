import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Archive from './pages/Archive';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import ArchiveDetail from './pages/ArchiveDetail';
import MessageDetail from './pages/MessageDetail';
import EditProfile from './pages/EditProfile';
import AddArchive from './pages/AddArchive';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomizeDashboard from './pages/CustomizeDashboard';
import { ArchiveProvider } from './context/ArchiveContext';

const App: React.FC = () => {
  return (
    <ArchiveProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard/customize" element={<CustomizeDashboard />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/archive/add" element={<AddArchive />} />
          <Route path="/archive/:id" element={<ArchiveDetail />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<MessageDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ArchiveProvider>
  );
};

export default App;