import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { userAPI } from '../services';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAll({ role: 'doctor' });
      setDoctors(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    form.setFieldsValue(doctor);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await userAPI.delete(id);
      message.success('Doctor deleted successfully');
      fetchDoctors();
    } catch (error) {
      message.error('Failed to delete doctor');
    }
  };

  const onFinish = async (values) => {
    try {
      if (editingDoctor) {
        await userAPI.update(editingDoctor.id, values);
        message.success('Doctor updated successfully');
      } else {
        await userAPI.create(values);
        message.success('Doctor created successfully');
      }
      setIsModalVisible(false);
      fetchDoctors();
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) => (is_active ? 'Active' : 'Inactive'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditDoctor(record)}
            style={{ marginRight: '8px' }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Manage Doctors</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddDoctor}
        style={{ marginBottom: '16px' }}
      >
        Add Doctor
      </Button>

      <Table
        columns={columns}
        dataSource={doctors}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingDoctor ? 'Edit Doctor' : 'Add Doctor'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input doctor name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input doctor email!' },
              { type: 'email', message: 'Invalid email format!' },
            ]}
          >
            <Input />
          </Form.Item>

          {!editingDoctor && (
            <Form.Item
              label="Role"
              name="role"
              initialValue="doctor"
            >
              <Select disabled>
                <Select.Option value="doctor">Doctor</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ManageDoctors;
