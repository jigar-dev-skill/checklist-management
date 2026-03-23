import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown } from 'antd';
import { LogoutOutlined, DashboardOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../store/authSlice';
import { authAPI } from '../services';

const { Header, Content, Sider } = Layout;

const DoctorLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('authToken');
      dispatch(clearUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/doctor/dashboard'),
    },
    {
      key: 'patients',
      icon: <UserOutlined />,
      label: 'My Patients',
      onClick: () => navigate('/doctor/patients'),
    },
    {
      key: 'checklists',
      icon: <FileTextOutlined />,
      label: 'Checklists',
      onClick: () => navigate('/doctor/checklists'),
    },
    {
      key: 'reports',
      icon: <FileTextOutlined />,
      label: 'Reports',
      onClick: () => navigate('/doctor/reports'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ padding: '16px', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          {!collapsed && 'Checklist'}
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: 0 }}>Doctor Panel</h2>
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
            <Button type="text">{user?.name}</Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: '16px', padding: '16px', background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorLayout;
