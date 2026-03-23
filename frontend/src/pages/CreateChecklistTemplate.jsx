import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Select, Card, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { templateAPI } from '../services';

const CreateChecklistTemplate = () => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState([{ id: 0, label: '', type: 'text', required: false }]);
  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(false);

  const fieldTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Radio', value: 'radio' },
    { label: 'Dropdown', value: 'dropdown' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Date', value: 'date' },
    { label: 'Email', value: 'email' },
    { label: 'Number', value: 'number' },
  ];

  const addField = () => {
    setFields([...fields, { id: nextId, label: '', type: 'text', required: false }]);
    setNextId(nextId + 1);
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        fields: fields.map(f => ({
          label: f.label,
          type: f.type,
          required: f.required,
          options: f.options,
          help_text: f.help_text,
        })),
      };

      await templateAPI.create(payload);
      message.success('Checklist template created successfully');
      form.resetFields();
      setFields([{ id: 0, label: '', type: 'text', required: false }]);
      setNextId(1);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Checklist Template</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Template Name"
          name="name"
          rules={[{ required: true, message: 'Please input template name!' }]}
        >
          <Input placeholder="e.g., Patient Initial Consultation" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea placeholder="Optional description" rows={3} />
        </Form.Item>

        <Card title="Checklist Fields" style={{ marginBottom: '16px' }}>
          {fields.map((field, index) => (
            <div key={field.id} style={{ marginBottom: '16px', padding: '16px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 100px 100px', gap: '8px', alignItems: 'center' }}>
                <Input
                  placeholder="Field Label"
                  value={field.label}
                  onChange={(e) => updateField(field.id, 'label', e.target.value)}
                />
                <Select
                  value={field.type}
                  onChange={(value) => updateField(field.id, 'type', value)}
                  options={fieldTypes}
                />
                <Checkbox
                  checked={field.required}
                  onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                >
                  Required
                </Checkbox>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeField(field.id)}
                  disabled={fields.length === 1}
                />
              </div>
            </div>
          ))}

          <Button type="dashed" icon={<PlusOutlined />} onClick={addField} block style={{ marginTop: '16px' }}>
            Add Field
          </Button>
        </Card>

        <Button type="primary" htmlType="submit" loading={loading}>
          Create Template
        </Button>
      </Form>
    </div>
  );
};

export default CreateChecklistTemplate;
