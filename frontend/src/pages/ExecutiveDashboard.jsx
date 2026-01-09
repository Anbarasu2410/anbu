import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert } from 'antd';
import {
  fetchDashboardSummary,
  fetchAISummary
} from '../api/dashboardApi';

import KPIStatCard from '../components/KPIStatCard';
import AISummaryPanel from '../components/AISummaryPanel';
import ProjectStatusTable from '../components/ProjectStatusTable';
import AttendanceSnapshot from '../components/AttendanceSnapshot';

// 🔒 MUST come from auth context / JWT decode
import { useAuth } from '../context/AuthContext';

const ExecutiveDashboard = () => {
  let { company, user } = useAuth(); // ⬅️ NO HARDCODED TENANT
company={id:1}
  console.log("company",company)
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [aiSummary, setAiSummary] = useState([]);
  const [error, setError] = useState(null);

  // ⚠️ UI does NOT decide business date
  const businessDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!company?.id) return;
    loadDashboard();
  }, [company?.id]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("companyId",company.id)
      const { data } = await fetchDashboardSummary({
        companyId: company.id, // backend must still re-scope
        date: businessDate
      });

      setSummary(data);

      // AI is OPTIONAL – never blocks dashboard
      try {
        const aiRes = await fetchAISummary({
          date: businessDate,
          projects: data.projects,
          attendance: data.kpis.attendance
        });
        setAiSummary(aiRes.data.summary || []);
      } catch {
        setAiSummary([]);
      }

    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (!company) {
    return (
      <div className="p-6">
        <Alert
          type="error"
          message="No company context found"
          description="User is not associated with any company."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert type="error" message={error} />
      </div>
    );
  }

  const { kpis, projects } = summary;

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen font-sans">

      {/* HEADER */}
      <Card bordered className="shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div>
            <h2 className="text-xl font-bold uppercase">
              Executive Dashboard
            </h2>
            <div className="text-sm text-gray-600">
              Company: <strong>{company.name}</strong>
            </div>
            <div className="text-sm text-gray-600">
              Date: {businessDate}
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2 sm:mt-0">
            Logged in as: {user?.name}
          </div>
        </div>
      </Card>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIStatCard
          title="Ongoing Projects"
          value={kpis.ongoingProjects}
        />
        <KPIStatCard
          title="Delayed Projects"
          value={kpis.delayedProjects}
        />
        <KPIStatCard
          title="Manpower Deployed"
          value={kpis.manpowerDeployed.total}
        />
        <KPIStatCard
          title="Present Today"
          value={kpis.attendance.present}
        />
      </div>

      {/* MANPOWER BY TRADE */}
      <Card title="Manpower by Trade" bordered>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(kpis.manpowerDeployed.byTrade).map(
            ([trade, count]) => (
              <div
                key={trade}
                className="bg-white border rounded p-3 text-center"
              >
                <div className="text-sm text-gray-500 uppercase">
                  {trade}
                </div>
                <div className="text-xl font-bold">
                  {count}
                </div>
              </div>
            )
          )}
        </div>
      </Card>

      {/* AI INSIGHTS */}
      <AISummaryPanel summary={aiSummary} />

      {/* PROJECT STATUS + PROGRESS */}
      <ProjectStatusTable projects={projects} />

      {/* ATTENDANCE SNAPSHOT */}
      <AttendanceSnapshot attendance={kpis.attendance} />

      {/* BILLING DISCLAIMER */}
      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded text-sm text-yellow-900">
        <strong>Billing & Claims:</strong> Outstanding invoices and progress
        claims are not yet integrated. No billing data is shown to avoid
        misleading information.
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
