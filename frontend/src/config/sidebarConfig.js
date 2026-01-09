// sidebarConfig.js
import {
  HomeOutlined,
  TeamOutlined,
  ProjectOutlined,
  MessageOutlined,
  CheckSquareOutlined,
  DeploymentUnitOutlined,
  ScheduleOutlined,
  DashboardOutlined,
  CarOutlined,
  UserOutlined,
  FileTextOutlined,
  ContactsOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';

export const SIDEBAR_CONFIG = [
  // Home
  {
    key: '/',
    label: 'Home',
    icon: HomeOutlined,
    permission: 'HOME_VIEW',
    path: '/',
  },
  {
  key: '/boss/dashboard',
  label: ' Dashboard',
  icon: DashboardOutlined,
  permission: 'DASHBOARD_VIEW',
  path: '/boss/dashboard',
},
// {
//   key: '/boss/projects/:projectId',
//   label: 'Project Details',
//   icon: ProjectOutlined,
//   path: '/boss/projects/1',
//   permission:'PROJECT_OVERVIEW_VIEW',
//   //permissions: ['PROJECT_OVERVIEW_VIEW', 'PROJECT_PROGRESS_VIEW', 'AI_RISK_VIEW'],
// },
{
  key: '/boss/projects',
  label: 'Projects',
  icon: ProjectOutlined,
  path: '/boss/projects',
  permission: 'PROJECT_OVERVIEW_VIEW'
},

{
    key: '/boss/reports',
    label: 'Reports Dashboard',
    icon: FileTextOutlined,
    path: '/boss/reports',
    permission: 'REPORT_VIEW'
  },



  // Execution
  {
    key: 'execution',
    label: ' Deployment Planning',
    permission: 'DEPLOYMENT_VIEW',
    icon: DeploymentUnitOutlined,
    children: [
      {
        key: '/execution/task-management/daily-worker-deployment',
        label: 'Daily Worker Deployment List',
         icon: CheckSquareOutlined,
        permission: 'DEPLOYMENT_VIEW',
        path: '/execution/task-management/daily-worker-deployment',
      },
      {
        key: '/execution/task-management/daily-manpower-status',
        label: 'Assign Workers (Next Day)',
        icon: UserOutlined, 
        permission: 'DEPLOYMENT_VIEW',
        path: '/execution/task-management/daily-worker-deployment',
      },
    ],
  },

  // Projects
  // {
  //   key: 'projects',
  //   label: 'Projects',
  //   icon: ProjectOutlined,
  //   children: [
  //     {
  //       key: '/project',
  //       label: 'Project',
  //    //   permission: 'PROJECT_VIEW',
  //       path: '/project',
  //     },
  //   ],
  // },

  {
    key: 'projects',
    label: 'Projects',
     permission: 'PROJECT_VIEW',
    icon: ProjectOutlined,
    children: [
      {
        key: '/project',
        label: 'Project',
        icon: ProjectOutlined,
        permission: 'PROJECT_VIEW',
        path: '/project',
      },
      {
        key: '/scrumboard',
        label: 'Scrumboard',
        permission: 'SCRUMBOARD_VIEW',
        path: '/scrumboard',
      },
    ],
  },

  // Progress
  {
    key: 'progress',
    label: 'Progress',
    permission: 'PROGRESS_DASHBOARD_VIEW',
    icon: DashboardOutlined,
    children: [
      {
        key: '/progress-dashboard',
        label: 'Progress Dashboard',
          icon: DashboardOutlined,
        permission: 'PROGRESS_DASHBOARD_VIEW',
        path: '/progress-dashboard',
      },
      {
        key: '/progress-report',
        label: 'Progress Report',
        icon: FileTextOutlined, 
        permission: 'PROGRESS_REPORT_VIEW',
        path: '/progress-report',
      },
    ],
  },

  // Organization
  {
    key: 'Employees',
    label: 'Employees',
    permission: 'EMPLOYEE_VIEW',
    icon: TeamOutlined,
    children: [
     
      {
        key: '/employees',
        label: 'Employees List',
         icon: TeamOutlined,
        permission: 'EMPLOYEE_VIEW',
        path: '/employees',
      },
       {
        key: '/employees/create',
        label: 'Add Employee',
         icon: TeamOutlined,
        permission: 'EMPLOYEE_VIEW',
        path: '/employees/create',
      },
     


      {
        key: '/contacts',
        label: 'Contacts',
        permission: 'CONTACT_VIEW',
        path: '/contacts',
      },
    ],
  },

  // Fleet
  {
    key: 'fleet',
    label: 'Fleet',
    permission: 'VEHICLE_VIEW',
    icon: CarOutlined,
    children: [
      {
        key: '/vehicles',
        label: 'Vehicles',
                icon: CarOutlined, 
        permission: 'VEHICLE_VIEW',
        path: '/vehicles',
      },
      {
        key: '/drivers',
        label: 'Drivers',
        icon: UserOutlined,
        permission: 'DRIVER_VIEW',
        path: '/drivers',
      },
      {
        key: '/fleet-tasks',
        label: 'Fleet Tasks',
        icon: CheckSquareOutlined, // added
        permission: 'FLEET_TASK_VIEW',
        path: '/fleet-tasks',
      },
    ],
  },

  // Tasks
  {
    key: 'tasks',
    label: 'Tasks',
    permission: 'TASK_VIEW',
    icon: ScheduleOutlined,
    children: [
      {
        key: '/tasks',
        label: 'Tasks',
         icon: ScheduleOutlined,
        permission: 'TASK_VIEW',
        path: '/tasks',
      },
      {
        key: '/notes',
        label: 'Notes',
        icon: FileTextOutlined,
        permission: 'NOTE_VIEW',
        path: '/notes',
      },
      {
        key: '/invoice',
        label: 'Invoice',
        icon: FileDoneOutlined,
        permission: 'INVOICE_VIEW',
        path: '/invoice',
      },
    ],
  },
];



