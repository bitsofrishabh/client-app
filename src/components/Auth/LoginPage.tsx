import React, { useState } from 'react';
import { Button, Card, Typography, Space, Alert, Form, Input, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (values: any) => {
    setLoading(true);
    setError(null);
    
    try {
      await signIn(values.email, values.password);
    } catch (error: any) {
      setError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (values: any) => {
    setLoading(true);
    setError(null);
    
    try {
      await signUp(values.email, values.password, values.name);
    } catch (error: any) {
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginForm = (
    <Form onFinish={handleLogin} layout="vertical" size="large">
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Enter your email" />
      </Form.Item>
      
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
      </Form.Item>
      
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          style={{
            height: 48,
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #2E7D5A 0%, #4CAF50 100%)',
            border: 'none',
          }}
        >
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );

  const signUpForm = (
    <Form onFinish={handleSignUp} layout="vertical" size="large">
      <Form.Item
        name="name"
        label="Full Name"
        rules={[{ required: true, message: 'Please enter your full name' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
      </Form.Item>
      
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Enter your email" />
      </Form.Item>
      
      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please enter your password' },
          { min: 6, message: 'Password must be at least 6 characters' }
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Create a password" />
      </Form.Item>
      
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          style={{
            height: 48,
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #2E7D5A 0%, #4CAF50 100%)',
            border: 'none',
          }}
        >
          Create Account
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2E7D5A 0%, #4CAF50 50%, #66BB6A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ margin: 0, color: '#2E7D5A' }}>
              DietTracker
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Your Personal Diet Companion
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ borderRadius: 8 }}
            />
          )}

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            items={[
              {
                key: 'login',
                label: 'Sign In',
                children: loginForm,
              },
              {
                key: 'signup',
                label: 'Sign Up',
                children: signUpForm,
              },
            ]}
          />
        </Space>
      </Card>
    </div>
  );
};

export default LoginPage;