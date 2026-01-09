import { Card, Empty } from 'antd';

const AISummaryPanel = ({ summary = [] }) => {
  return (
    <Card title="AI Insights" bordered>
      {summary.length === 0 ? (
        <Empty
          description="No AI insights available"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <ul className="space-y-2 list-disc pl-5 text-gray-700">
          {summary.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default AISummaryPanel;
