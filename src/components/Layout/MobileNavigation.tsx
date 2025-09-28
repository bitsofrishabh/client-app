import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HomeOutlined, CameraOutlined, MessageOutlined, UserOutlined, BarChartOutlined } from '@ant-design/icons';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/progress',
      icon: <BarChartOutlined />,
      label: 'Progress',
    },
    {
      key: '/meals',
      icon: <CameraOutlined />,
      label: 'Meals',
    },
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: 'Chat',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
  ];

  return (
    <div className="mobile-nav">
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {navItems.map((item) => (
          <div
            key={item.key}
            className={`mobile-nav-item ${location.pathname === item.key ? 'active' : ''}`}
            onClick={() => navigate(item.key)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;