import { Table, Tag } from 'antd';

const statusColor = {
  'ON_TRACK': 'green',
  'DELAYED': 'red',
  'COMPLETED': 'blue'
};

const ProjectStatusTable = ({ projects = [] }) => {
  const columns = [
    {
      title: 'Project Code',
      dataIndex: 'projectCode',
      key: 'projectCode'
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColor[status] || 'default'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Overall Progress (%)',
      dataIndex: 'overallProgress',
      key: 'overallProgress',
      render: (val) => `${val ?? 0}%`
    }
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={projects}
      pagination={false}
      bordered
    />
  );
};

export default ProjectStatusTable;
