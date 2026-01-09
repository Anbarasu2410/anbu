import { Card } from 'antd';

const KPIStatCard = ({ title, value }) => {
  return (
    <Card bordered className="shadow-sm">
      <div className="text-gray-500 text-sm uppercase tracking-wide">
        {title}
      </div>
      <div className="text-3xl font-bold text-gray-900 mt-1">
        {value ?? '—'}
      </div>
    </Card>
  );
};

export default KPIStatCard;
