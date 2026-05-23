import { Request, Response, NextFunction } from 'express';
import employeeService from '../services/employee.service';
import { RequestListener } from 'node:http';

const employeeController = {
    //GET /api/employees
    async getAllEmployees(req: Request, res: Response, next: NextFunction) {
        try {
            const employees = await employeeService.getAllEmployees();
            
            res.status(200).json({
                status: 'success',
                results: employees.length,
                data: { employees }
            });
        } catch(error){
            next(error);
        }
    },

    //GET /api/employees/:id
    async getEmployeeById(req: Request, res: Response, next: NextFunction){
        try{
            const employee = await employeeService.getEmployeeById(
                req.params.id as string
            );

            res.status(200).json({
                status: 'success',
                data: { employee },
            });
        } catch(error) {
            next(error);
        }
    },

    // POST /api/employees
    async createEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const employee = await employeeService.createEmployee(req.body);

            res.status(201).json({
                status: 'success',
                data: { employee },
            });
        } catch (error) {
            next(error);
        }
    },

    //PATCH /api/employees/:id
    async updateEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const employee = await employeeService.updateEmployee(
                req.params.id as string,
                req.body
            );

            res.status(200).json({
                status: 'success',
                data: { employee },
            });
        } catch (error) {
            next(error);
        }
    },
     
    //DELETE /api/employees/:id
    async deactivateEmployee(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try{
            const result = await employeeService.deactivateEmployee(
                req.params.id as string,
                req.user!.userId //Requester ka id
            );

            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    //PATCH /api/employees/:id/reset-password
    async resetPassword(req: Request, res: Response, next: NextFunction){
        try {
            const result = await employeeService.resetEmployeePassword(
                req.params.id as string
            );

            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (error){
            next(error);
        }
    },
};

export default employeeController;
