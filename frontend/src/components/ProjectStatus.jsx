import React, { useMemo } from 'react';
import { Table, Tag, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';

const statusColor = {
  ON_TRACK: 'green',
  DELAYED: 'red',
  COMPLETED: 'blue'
};

const ProjectStatus = ({ projects = [] }) => {
  const navigate = useNavigate();

  // 🔴 dedupe by projectId (backend bug guard)
  const data = useMemo(() => {
    const map = new Map();
    projects.forEach(p => {
      if (!map.has(p.projectId)) {
        map.set(p.projectId, p);
      }
    });
    return Array.from(map.values());
  }, [projects]);

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text, record) => (
        <a
          onClick={() => navigate(`/boss/projects/${record.projectId}`)}
        >
          {text}
        </a>
      )
    },
    {
      title: 'Manager',
      key: 'manager',
      render: (_, record) =>
        record.manager?.name || '—'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={statusColor[status] || 'default'}>
          {status.replace('_', ' ')}
        </Tag>
      )
    },
    {
      title: 'Progress',
      dataIndex: 'overallProgress',
      key: 'overallProgress',
      render: value => (
        <Progress percent={value || 0} size="small" />
      )
    }
  ];

  return (
    <Table
      rowKey="projectId"
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
};

export default ProjectStatus;
