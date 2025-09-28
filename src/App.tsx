import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import MealLogger from './components/Meals/MealLogger';
import ChatInterface from './components/Chat/ChatInterface';
import MobileNavigation from './components/Layout/MobileNavigation';

const theme = {
  token: {
    colorPrimary: '#2E7D5A',
    colorSuccess: '#4CAF50',
    colorWarning: '#FF9800',
    colorError: '#F44336',
    colorInfo: '#1976D2',
    borderRadius: 8,
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    Card: {
      borderRadiusLG: 12,
    },
    Button: {
      borderRadius: 8,
    },
    Input: {
      borderRadius: 6,
    },
  },
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <ConfigProvider theme={theme}>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#F8FAF9'
        }}>
          <Spin size="large" />
        </div>
      </ConfigProvider>
    );
  }

  if (!user) {
    return (
      <ConfigProvider theme={theme}>
        <LoginPage />
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={theme}>
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAF9' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/progress" element={<div>Progress Page</div>} />
          <Route path="/meals" element={<MealLogger />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/profile" element={<div>Profile Page</div>} />
        </Routes>
        <MobileNavigation />
      </div>
    </ConfigProvider>
  );
}

export default App;