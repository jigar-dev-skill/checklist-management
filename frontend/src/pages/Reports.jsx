import React, { useState } from 'react';
import { Button, DatePicker, Select, Table, Space, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { reportAPI } from '../services';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [status, setStatus] = useState(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateRange[0]) params.start_date = dateRange[0].format('YYYY-MM-DD');
      if (dateRange[1]) params.end_date = dateRange[1].format('YYYY-MM-DD');
      if (status) params.status = status;

      const response = await reportAPI.getReports(params);
      setReports(response.data.reports || []);
      message.success('Report generated successfully');
    } catch (error) {
      message.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const params = {};
      if (dateRange[0]) params.start_date = dateRange[0].format('YYYY-MM-DD');
      if (dateRange[1]) params.end_date = dateRange[1].format('YYYY-MM-DD');

      const response = await reportAPI.exportExcel(params);
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      message.success('Report exported to Excel');
    } catch (error) {
      message.error('Failed to export Excel report');
    }
  };

  const handleExportPDF = async () => {
    try {
      const params = {};
      if (dateRange[0]) params.start_date = dateRange[0].format('YYYY-MM-DD');
      if (dateRange[1]) params.end_date = dateRange[1].format('YYYY-MM-DD');

      const response = await reportAPI.exportPDF(params);
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      message.success('Report exported to PDF');
    } catch (error) {
      message.error('Failed to export PDF report');
    }
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: ['patient', 'name'],
      key: 'patient',
    },
    {
      title: 'Doctor',
      dataIndex: ['doctor', 'name'],
      key: 'doctor',
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
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <h1>Reports</h1>
      <div style={{ marginBottom: '24px', padding: '16px', background: '#fafafa', borderRadius: '4px' }}>
        <Space>
          <DatePicker.RangePicker
            onChange={(dates) => setDateRange(dates)}
            placeholder={['Start Date', 'End Date']}
          />
          <Select
            placeholder="Filter by Status"
            style={{ width: 150 }}
            onChange={setStatus}
            allowClear
          >
            <Select.Option value="draft">Draft</Select.Option>
            <Select.Option value="submitted">Submitted</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
          </Select>
          <Button type="primary" loading={loading} onClick={handleGenerateReport}>
            Generate Report
          </Button>
          <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
            Export Excel
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
            Export PDF
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={reports}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Reports;
