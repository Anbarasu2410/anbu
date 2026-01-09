import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Typography, Space } from 'antd';
import dayjs from 'dayjs';

import {
  fetchAttendanceSummary,
  fetchWorkerComparison,
  fetchProjectUtilization,
  //fetchAIInsights
} from '../../api/bossReportsApi';

import AttendanceSummaryCard from '../../components/boss/reports/AttendanceSummaryCard';
import WorkerComparisonCard from '../../components/boss/reports/WorkerComparisonCard';
import ProjectUtilizationTable from '../../components/boss/reports/ProjectUtilizationTable';
//import AIInsightsPanel from '../../components/boss/reports/AIInsightsPanel';
import ReportActions from '../../components/boss/reports/ReportAction';

const { Title, Text } = Typography;

export default function ReportsDashboard() {
  // ================= STATE =================
  const [period, setPeriod] = useState({
    from: '2026-01-01',
    to: '2026-01-31'
  });

  const [attendance, setAttendance] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  //const [aiInsights, setAiInsights] = useState([]);

  // ================= EFFECT =================
  useEffect(() => {
    loadReports();
  }, [period]);

  // ================= FUNCTIONS =================
  const loadReports = async () => {
    const [
      attendanceRes,
      workersRes,
      projectsRes,
      aiRes
    ] = await Promise.all([
      fetchAttendanceSummary(period),
      fetchWorkerComparison(period),
      fetchProjectUtilization(period),
     // fetchAIInsights(period)
    ]);

    setAttendance(attendanceRes?.data || null);
    setWorkers(workersRes?.data?.topPerformers || []);
    setProjects(projectsRes?.data?.projects || []);
   // setAiInsights(aiRes?.data?.insights || []);
  };

  const handleNextPeriod = () => {
    const nextMonth = dayjs(period.from).add(1, 'month');

    setPeriod({
      from: nextMonth.startOf('month').format('YYYY-MM-DD'),
      to: nextMonth.endOf('month').format('YYYY-MM-DD')
    });
  };

  const displayPeriod = dayjs(period.from).format('MMM YYYY');

  // ================= UI =================
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>

      {/* ================= HEADER ================= */}
      <Card>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} md={18}>
            <Title level={3} style={{ marginBottom: 4 }}>
              Reports Dashboard
            </Title>

            {/* <Text type="secondary">
              Company: Century Global Resources
            </Text> */}

            <br />

            <Text>
              Period: <strong>{displayPeriod}</strong>
            </Text>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: 'right' }}>
            <Button onClick={handleNextPeriod}>
              Change Period
            </Button>
          </Col>
        </Row>
      </Card>

      {/* ================= SUMMARY CARDS ================= */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <AttendanceSummaryCard data={attendance} />
        </Col>

        <Col xs={24} lg={12}>
          <WorkerComparisonCard workers={workers} />
        </Col>
      </Row>

      {/* ================= TABLE ================= */}
      <Row>
        <Col span={24}>
          <ProjectUtilizationTable projects={projects} />
        </Col>
      </Row>

      {/* ================= AI INSIGHTS ================= */}
      {/* <AIInsightsPanel insights={aiInsights} /> */}

      {/* ================= ACTIONS ================= */}
      <Row>
        <Col span={24}>
          <ReportActions period={period} />
        </Col>
      </Row>

    </Space>
  );
}
