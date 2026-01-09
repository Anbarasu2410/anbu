import { Card } from 'antd';

const AttendanceSnapshot = ({ attendance }) => {
  if (!attendance) {
    return (
      <Card title="Attendance Snapshot">
        No attendance data available.
      </Card>
    );
  }

  return (
    <Card title="Attendance Snapshot" bordered>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-gray-500 text-sm">Present</div>
          <div className="text-2xl font-bold">
            {attendance.present}
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-sm">Absent</div>
          <div className="text-2xl font-bold">
            {attendance.absent}
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-sm">Late</div>
          <div className="text-2xl font-bold">
            {attendance.late ?? 0}
          </div>
        </div>

        <div>
          <div className="text-gray-500 text-sm">Total</div>
          <div className="text-2xl font-bold">
            {attendance.total}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceSnapshot;
