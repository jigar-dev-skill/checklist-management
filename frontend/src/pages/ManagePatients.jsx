import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { patientAPI } from '../services';

const ManagePatients = ({ doctorOnly = false }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    form.setFieldsValue({
      name: patient.name,
      mobile_number: patient.mobile_number,
      city_village: patient.city_village,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await patientAPI.delete(id);
      message.success('Patient deleted successfully');
      fetchPatients();
    } catch (error) {
      message.error('Failed to delete patient');
    }
  };

  const onFinish = async (values) => {
    try {
      if (editingPatient) {
        await patientAPI.update(editingPatient.id, values);
        message.success('Patient updated successfully');
      } else {
        await patientAPI.create(values);
        message.success('Patient created successfully');
      }
      setIsModalVisible(false);
      fetchPatients();
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
      title: 'Mobile',
      dataIndex: 'mobile_number',
      key: 'mobile_number',
    },
    {
      title: 'City/Village',
      dataIndex: 'city_village',
      key: 'city_village',
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
            onClick={() => handleEditPatient(record)}
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
      <h1>{doctorOnly ? 'My Patients' : 'Manage Patients'}</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddPatient}
        style={{ marginBottom: '16px' }}
      >
        Add Patient
      </Button>

      <Table
        columns={columns}
        dataSource={patients}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingPatient ? 'Edit Patient' : 'Add Patient'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input patient name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mobile Number"
            name="mobile_number"
            rules={[{ required: true, message: 'Please input mobile number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="City/Village"
            name="city_village"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagePatients;
