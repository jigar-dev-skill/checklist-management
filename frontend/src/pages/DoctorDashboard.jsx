import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, message } from 'antd';
import { UserOutlined, FileTextOutlined, CheckOutlined } from '@ant-design/icons';
import { dashboardAPI } from '../services';

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getDoctorDashboard();
      setDashboardData(response.data);
    } catch (error) {
      message.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Patients"
              value={dashboardData?.total_patients || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Checklists"
              value={dashboardData?.total_checklists || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Completed"
              value={dashboardData?.completed_checklists || 0}
              prefix={<CheckOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDashboard;
