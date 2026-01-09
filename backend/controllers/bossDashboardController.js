// import Project from '../models/ProjectModel.js';
// import Attendance from '../models/AttendanceModel.js';
// import Employee from '../models/EmployeeModel.js';
// import ProjectDailyProgress from '../models/ProjectDailyProgressModel.js';

// /**
//  * Dashboard Summary – Multi-Company Safe
//  */
// export const getDashboardSummary = async (req, res) => {
//   try {
//     console.log("req",req.query);
//     const { companyId, date } = req.query;
//     if (!companyId || !date) {
//       return res.status(400).json({ message: 'companyId and date are required' });
//     }

//     const selectedDate = new Date(date);
//     const startOfDay = new Date(selectedDate);
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date(selectedDate);
//     endOfDay.setHours(23, 59, 59, 999);

//     /* ======================================================
//        1. ONGOING PROJECTS (company-scoped)
//     ====================================================== */

//     const projects = await Project.find({
//       companyId,
//       status: { $regex: /^active$/i },
//       actualEndDate: { $exists: false }
//     }).lean();

//     const projectIds = projects.map(p => p.id);

//     /* ======================================================
//        2. LATEST OVERALL PROGRESS % PER PROJECT (SAFE)
//        → joins back to Project to enforce company isolation
//     ====================================================== */

//     const progressDocs = await ProjectDailyProgress.aggregate([
//       {
//         $match: {
//           projectId: { $in: projectIds },
//           date: { $lte: endOfDay }
//         }
//       },
//       { $sort: { date: -1 } },
//       {
//         $group: {
//           _id: '$projectId',
//           overallProgress: { $first: '$overallProgress' }
//         }
//       }
//     ]);

//     const progressMap = new Map(
//       progressDocs.map(p => [Number(p._id), p.overallProgress])
//     );

//     /* ======================================================
//        3. PROJECT STATUS (On-track / Delayed / Completed)
//     ====================================================== */

//     const projectCards = projects.map(project => {
//       const progress = progressMap.get(Number(project.id)) || 0;

//       let status = 'ON_TRACK';
//       if (project.actualEndDate) {
//         status = 'COMPLETED';
//       } else if (
//         project.endDate &&
//         new Date(project.endDate) < new Date() &&
//         progress < 100
//       ) {
//         status = 'DELAYED';
//       }

//       return {
//         projectId: project.id,
//         projectCode: project.projectCode,
//         projectName: project.projectName,
//         status,
//         overallProgress: progress
//       };
//     });

//     /* ======================================================
//        4. TODAY’S ATTENDANCE (TENANT-SAFE)
//        → attendance → employee → company
//     ====================================================== */

//   const targetDate = new Date(date);
// targetDate.setUTCHours(18, 30, 0, 0); // IST midnight stored in UTC

// const attendanceToday = await Attendance.find({
//   date: targetDate
// }).lean();

// const employeeIds = attendanceToday.map(a => a.employeeId);

// const employees = await Employee.find({
//   id: { $in: employeeIds },
//   companyId,
//   status: 'ACTIVE'
// }).lean();

// const validEmployeeIds = new Set(employees.map(e => e.id));

// const validAttendance = attendanceToday.filter(a =>
//   validEmployeeIds.has(a.employeeId)
// );

//     /* ======================================================
//        5. TODAY’S MANPOWER DEPLOYED (TOTAL + TRADE-WISE)
//     ====================================================== */

//     const manpowerByTrade = {};
//     for (const emp of employees) {
//       const trade = emp.jobTitle || 'UNKNOWN';
//       manpowerByTrade[trade] = (manpowerByTrade[trade] || 0) + 1;
//     }

//     /* ======================================================
//        6. ATTENDANCE SUMMARY (NO FAKE DATA)
//     ====================================================== */

//     const present = validAttendance.filter(a => a.checkIn).length;

//     const late = validAttendance.filter(a => {
//       if (!a.checkIn) return false;
//       const hour = new Date(a.checkIn).getHours();
//       return hour > 9; // configurable
//     }).length;

//     const attendanceSummary = {
//       present,
//       late,
//       absent: null // cannot be calculated correctly without leave + expected manpower
//     };

//     /* ======================================================
//        7. BILLING (NOT SUPPORTED – HONEST RESPONSE)
//     ====================================================== */

//     const billing = {
//       outstandingInvoices: null,
//       progressClaims: null,
//       note: 'Billing module not implemented'
//     };

//     /* ======================================================
//        FINAL RESPONSE
//     ====================================================== */

//   const delayedProjects = projectCards.filter(
//   p =>
//     p.expectedEndDate &&
//     p.actualEndDate &&
//     new Date(p.actualEndDate) > new Date(p.expectedEndDate)
// ).length;

// return res.json({
//   date,
//   companyId,
//   kpis: {
//     ongoingProjects: projects.length,
//     delayedProjects,
//     manpowerDeployed: {
//       total: present,
//       byTrade: manpowerByTrade
//     },
//     attendance: attendanceSummary
//   },
//   projects: projectCards,
//   billing
// });



//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Dashboard summary failed',
//       error: error.message
//     });
//   }
// };

import Project from '../models/ProjectModel.js';
import Attendance from '../models/AttendanceModel.js';
import Employee from '../models/EmployeeModel.js';
import ProjectDailyProgress from '../models/ProjectDailyProgressModel.js';
import WorkerTaskAssignment from '../models/WorkerTaskAssignmentModel.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const { companyId, date } = req.query;
    if (!companyId || !date) {
      return res.status(400).json({ message: 'companyId and date are required' });
    }

    /* ================= DATE RANGE ================= */
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    /* ================= PROJECTS ================= */
    const projects = await Project.find({
      companyId,
      status: { $regex: /^active$/i }
    }).lean();

    const projectIds = projects.map(p => p.id);

    /* ================= PROGRESS ================= */
    const progressDocs = await ProjectDailyProgress.aggregate([
      { $match: { projectId: { $in: projectIds }, date: { $lte: endOfDay } } },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: '$projectId',
          overallProgress: { $first: '$overallProgress' }
        }
      }
    ]);

    const progressMap = new Map(
      progressDocs.map(p => [Number(p._id), p.overallProgress])
    );

    /* ================= MANAGER RESOLUTION ================= */
    const assignments = await WorkerTaskAssignment.find({
      projectId: { $in: projectIds },
      companyId
    }).lean();

    const projectManagerMap = {};
    assignments.forEach(a => {
      if (!projectManagerMap[a.projectId] && a.supervisorId) {
        projectManagerMap[a.projectId] = a.supervisorId;
      }
    });

    const managerIds = Object.values(projectManagerMap);
    const managers = await Employee.find({
      id: { $in: managerIds },
      companyId
    }).lean();

    const managerMap = new Map(
      managers.map(m => [
        m.id,
        { id: m.id, name: m.fullName || m.name || 'Unknown' }
      ])
    );

    /* ================= PROJECT CARDS ================= */
    const projectCards = projects.map(p => {
      const progress = progressMap.get(Number(p.id)) || 0;

      let status = 'ON_TRACK';
      if (p.actualEndDate) status = 'COMPLETED';
      else if (p.expectedEndDate && new Date(p.expectedEndDate) < new Date() && progress < 100)
        status = 'DELAYED';

      const managerId = projectManagerMap[p.id];

      return {
        projectId: p.id,
        projectCode: p.projectCode,
        projectName: p.projectName,
        manager: managerMap.get(managerId) || null,
        status,
        overallProgress: progress
      };
    });

    /* ================= ATTENDANCE ================= */
    const targetDate = new Date(date);
    targetDate.setUTCHours(18, 30, 0, 0); // IST → UTC

    const attendanceToday = await Attendance.find({ date: targetDate }).lean();

    const employeeIds = attendanceToday.map(a => a.employeeId);

    const employees = await Employee.find({
      id: { $in: employeeIds },
      companyId,
      status: 'ACTIVE'
    }).lean();

    const validEmployeeIds = new Set(employees.map(e => e.id));
    const validAttendance = attendanceToday.filter(a =>
      validEmployeeIds.has(a.employeeId)
    );

    const present = validAttendance.filter(a => a.checkIn).length;
    const late = validAttendance.filter(a => a.checkIn && new Date(a.checkIn).getHours() > 9).length;

    /* ================= MANPOWER ================= */
    const manpowerByTrade = {};
    employees.forEach(e => {
      const trade = e.jobTitle || 'UNKNOWN';
      manpowerByTrade[trade] = (manpowerByTrade[trade] || 0) + 1;
    });

    /* ================= RESPONSE ================= */
    return res.json({
      date,
      companyId,
      kpis: {
        ongoingProjects: projects.length,
        delayedProjects: projectCards.filter(p => p.status === 'DELAYED').length,
        manpowerDeployed: {
          total: present,
          byTrade: manpowerByTrade
        },
        attendance: {
          present,
          late,
          absent: null
        }
      },
      projects: projectCards,
      billing: {
        outstandingInvoices: null,
        progressClaims: null,
        note: 'Billing module not implemented'
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Dashboard summary failed',
      error: error.message
    });
  }
};
