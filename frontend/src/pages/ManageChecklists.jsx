import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Select, message, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { checklistAPI, templateAPI, patientAPI } from '../services';
import DynamicChecklistForm from '../components/DynamicChecklistForm';

const ManageChecklists = () => {
  const [checklists, setChecklists] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchChecklists();
    fetchTemplates();
    fetchPatients();
  }, []);

  const fetchChecklists = async () => {
    setLoading(true);
    try {
      const response = await checklistAPI.getAll();
      setChecklists(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch checklists');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await templateAPI.getAll();
      setTemplates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getAll();
      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleCreateChecklist = () => {
    setSelectedChecklist(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const onFinish = async (values) => {
    try {
      await checklistAPI.create(values);
      message.success('Checklist created successfully');
      setIsModalVisible(false);
      fetchChecklists();
    } catch (error) {
      message.error('Failed to create checklist');
    }
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: ['patient', 'name'],
      key: 'patient',
    },
    {
      title: 'Template',
      dataIndex: ['template', 'name'],
      key: 'template',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = { draft: 'blue', submitted: 'orange', completed: 'green' };
        return <span style={{ color: colors[status] }}>{status}</span>;
      },
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          size="small"
          onClick={() => setSelectedChecklist(record)}
        >
          View/Edit
        </Button>
      ),
    },
  ];

  if (selectedChecklist) {
    return (
      <div>
        <Button onClick={() => setSelectedChecklist(null)} style={{ marginBottom: '16px' }}>
          Back to List
        </Button>
        <DynamicChecklistForm
          checklistId={selectedChecklist.id}
          templateId={selectedChecklist.template_id}
          onSubmit={() => {
            setSelectedChecklist(null);
            fetchChecklists();
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <h1>Manage Checklists</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleCreateChecklist}
        style={{ marginBottom: '16px' }}
      >
        New Checklist
      </Button>

      <Table
        columns={columns}
        dataSource={checklists}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Create New Checklist"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Patient"
            name="patient_id"
            rules={[{ required: true, message: 'Please select a patient!' }]}
          >
            <Select placeholder="Select patient">
              {patients.map(patient => (
                <Select.Option key={patient.id} value={patient.id}>
                  {patient.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Checklist Template"
            name="template_id"
            rules={[{ required: true, message: 'Please select a template!' }]}
          >
            <Select placeholder="Select template">
              {templates.map(template => (
                <Select.Option key={template.id} value={template.id}>
                  {template.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageChecklists;
