import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Progress, Button, Row, Col, Statistic, Alert } from 'antd';
import { TrophyOutlined, CalendarOutlined, ScaleOutlined, FireOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { clientData } = useAuth();
  const [todayProgress, setTodayProgress] = useState({
    morningDrink: false,
    breakfast: false,
    lunch: false,
    dinner: false,
    nightDrink: false,
    workout: false,
  });

  const calculateProgress = () => {
    const completed = Object.values(todayProgress).filter(Boolean).length;
    return Math.round((completed / 6) * 100);
  };

  const getDaysRemaining = () => {
    if (!clientData?.dietEndDate) return null;
    const end = new Date(clientData.dietEndDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getWeightLoss = () => {
    if (!clientData?.startWeight || !clientData?.currentWeight) return 0;
    return clientData.startWeight - clientData.currentWeight;
  };

  const progressPercentage = calculateProgress();
  const daysRemaining = getDaysRemaining();
  const weightLoss = getWeightLoss();

  return (
    <div style={{ padding: '16px', paddingBottom: '80px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Welcome Section */}
        <Card style={{ borderRadius: 12, background: 'linear-gradient(135deg, #2E7D5A 0%, #4CAF50 100%)' }}>
          <div style={{ color: 'white' }}>
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              Welcome back, {clientData?.name || 'User'}!
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
              Let's continue your health journey today
            </Text>
          </div>
        </Card>

        {/* Quick Stats */}
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Card style={{ borderRadius: 12, textAlign: 'center' }}>
              <Statistic
                title="Weight Loss"
                value={weightLoss}
                suffix="kg"
                valueStyle={{ color: '#52c41a', fontSize: 20 }}
                prefix={<ScaleOutlined />}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ borderRadius: 12, textAlign: 'center' }}>
              <Statistic
                title="Days Left"
                value={daysRemaining || 0}
                valueStyle={{ color: '#1890ff', fontSize: 20 }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Today's Progress */}
        <Card title="Today's Progress" style={{ borderRadius: 12 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <Progress
                type="circle"
                percent={progressPercentage}
                format={(percent) => `${percent}%`}
                strokeColor="#52c41a"
                size={100}
              />
              <div style={{ marginTop: 8 }}>
                <Text strong>Daily Goals Completed</Text>
              </div>
            </div>

            <Space direction="vertical" style={{ width: '100%' }}>
              {[
                { key: 'morningDrink', label: 'Morning Drink', icon: '🥤' },
                { key: 'breakfast', label: 'Breakfast', icon: '🍳' },
                { key: 'lunch', label: 'Lunch', icon: '🥗' },
                { key: 'dinner', label: 'Dinner', icon: '🍽️' },
                { key: 'nightDrink', label: 'Night Drink', icon: '🥛' },
                { key: 'workout', label: 'Workout', icon: '💪' },
              ].map((item) => (
                <div key={item.key} className={`progress-item ${todayProgress[item.key as keyof typeof todayProgress] ? 'completed' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 20, marginRight: 12 }}>{item.icon}</span>
                    <Text strong>{item.label}</Text>
                  </div>
                  <Button
                    type={todayProgress[item.key as keyof typeof todayProgress] ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setTodayProgress(prev => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev]
                    }))}
                  >
                    {todayProgress[item.key as keyof typeof todayProgress] ? '✓' : 'Mark'}
                  </Button>
                </div>
              ))}
            </Space>
          </Space>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" style={{ borderRadius: 12 }}>
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Button
                type="primary"
                block
                size="large"
                icon={<CameraOutlined />}
                style={{ borderRadius: 8, height: 48 }}
              >
                Log Meal
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                size="large"
                icon={<MessageOutlined />}
                style={{ borderRadius: 8, height: 48 }}
              >
                Chat with Coach
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Motivational Message */}
        {progressPercentage >= 80 && (
          <Alert
            message="Great job today!"
            description="You're doing amazing with your daily goals. Keep up the excellent work!"
            type="success"
            showIcon
            icon={<TrophyOutlined />}
            style={{ borderRadius: 8 }}
          />
        )}
      </Space>
    </div>
  );
};

export default Dashboard;