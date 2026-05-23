import { Router } from 'express';
import employeeController from '../controllers/employee.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from '../utils/validation';

const router = Router();

// Saare employee routes:
// 1. Login hona chahiye (authenticate)
// 2. Admin hona chahiye (authorize)
router.use(authenticate, authorize('admin'));

// GET /api/employees
router.get('/', employeeController.getAllEmployees);

// GET /api/employees/:id
router.get('/:id', employeeController.getEmployeeById);

// POST /api/employees
router.post(
  '/',
  validate(createEmployeeSchema),
  employeeController.createEmployee
);

// PATCH /api/employees/:id
router.patch(
  '/:id',
  validate(updateEmployeeSchema),
  employeeController.updateEmployee
);

// DELETE /api/employees/:id
router.delete('/:id', employeeController.deactivateEmployee);

// PATCH /api/employees/:id/reset-password
router.patch(
  '/:id/reset-password',
  employeeController.resetPassword
);

export default router;