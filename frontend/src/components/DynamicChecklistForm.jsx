import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Checkbox, Radio, Select, DatePicker, message } from 'antd';
import { checklistAPI, templateAPI } from '../services';

const DynamicChecklistForm = ({ checklistId, templateId, onSubmit }) => {
  const [form] = Form.useForm();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const response = await templateAPI.get(templateId);
      setTemplate(response.data);
      setFormFields(response.data.fields || []);
    } catch (error) {
      message.error('Failed to fetch template');
    }
  };

  const renderField = (field) => {
    const key = `field_${field.id}`;

    switch (field.type) {
      case 'text':
        return (
          <Form.Item
            key={key}
            name={key}
            label={field.label}
            rules={field.required ? [{ required: true, message: `${field.label} is required` }] : []}
          >
            <Input placeholder={field.help_text} />
          </Form.Item>
        );

      case 'textarea':
        return (
          <Form.Item
            key={key}
            name={key}
            label={field.label}
            rules={field.required ? [{ required: true, message: `${field.label} is required` }] : []}
          >
            <Input.TextArea placeholder={field.help_text} rows={4} />
          </Form.Item>
        );

      case 'email':
        return (
          <Form.Item
            key={key}
            name={key}
            label={field.label}
            rules={[
              field.required ? { required: true, message: `${field.label} is required` } : {},
              { type: 'email', message: 'Invalid email' },
            ]}
          >
            <Input type="email" placeholder={field.help_text} />
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item
            key={key}
            name={key}
            label={field.label}
            rules={field.required ? [{ required: true, message: `${field.label} is required` }] : []}
          >
            <Input type="number" placeholder={field.help_text} />
          </Form.Item>
        );

      case 'date':
        return (
          <Form.Item
            key={key}
            name={key}
            label={field.label}
            rules={field.required ? [{ required: true, message: `${field.label} is required` }] : []}
          >
            <DatePicker />
          </Form.Item>
        );

      case 'checkbox':
        return (
          <Form.Item
            key={key}
            name={key}
            label={field.label}
            valuePropName="checked"
            rules={field.required ? [{ required: true, message: `${field.label} is required` }] : []}
          >
            <Checkbox>{field.label}</Checkbox>
          </Form.Item>
        );

      case 'radio':
        return (
          <Form.Item
            key={key}
            name={key}
            label={field.label}
            rules={field.required ? [{ required: true, message: `${field.label} is required` }] : []}
          >
            <Radio.Group options={field.options || []} />
          </Form.Item>
        );

      case 'dropdown':
        return (
          <Form.Item
            key={key}
            name={key}
            label={field.label}
            rules={field.required ? [{ required: true, message: `${field.label} is required` }] : []}
          >
            <Select
              placeholder={`Select ${field.label}`}
              options={(field.options || []).map(opt => ({ label: opt, value: opt }))}
            />
          </Form.Item>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const responses = Object.entries(values).map(([key, value]) => {
        const fieldId = parseInt(key.split('_')[1]);
        return { field_id: fieldId, value };
      });

      await checklistAPI.submitResponses(checklistId, { responses });
      message.success('Checklist submitted successfully');
      if (onSubmit) onSubmit();
    } catch (error) {
      message.error('Failed to submit checklist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={template?.name} style={{ marginBottom: '24px' }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {formFields.map(field => renderField(field))}
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit Checklist
        </Button>
      </Form>
    </Card>
  );
};

export default DynamicChecklistForm;
