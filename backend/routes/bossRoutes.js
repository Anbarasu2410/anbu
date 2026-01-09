import express from 'express';
import {
  getProjectOverview,
  getProjectProgressTimeline,
  getAttendanceSnapshot,
 // getFleetStatus
} from '../controllers/bossProjectController.js';
//import bossAuth from '../middlewares/bossAuth.js';
import { getFullProjectList } from '../controllers/bossProjectListController.js';
const router = express.Router();


router.get('/boss/projects/:projectId/overview', getProjectOverview);
router.get('/boss/projects/:projectId/progress-timeline',  getProjectProgressTimeline);
router.get('/boss/projects/:projectId/attendance-snapshot',  getAttendanceSnapshot);
router.get('/boss/projectList', getFullProjectList);
//router.get('/boss/projects/:projectId/fleet-status', getFleetStatus);

export default router;
