import employeeRepository from "../repositories/employee.repository";
import AppError from "../utils/AppError";
import crypto from  'crypto';

const employeeService = {
    //Get all employees
    async getAllEmployees(){
        const employees = await employeeRepository.findAll();
        return employees;
    },

    // GET SINGLE EMPLOYEE
    async getEmployeeById(id: string) {
        const employee = await employeeRepository.findById(id);

        if(!employee){
            throw new AppError('Employee not found', 404);
        }

        return employee;
    },

    // CREATE EMPLOYEE

    async createEmployee(data: {
        name: string;
        email: string;
        password: string;
        role: 'admin' | 'employee'
    }) {
        //Email already exist karta hai?
        const existing = await employeeRepository.findByEmail(data.email);

        if(existing){
            throw new AppError('Email already registered', 400)
        }

        const employee = await employeeRepository.create(data);

        return {
            id: employee._id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
            isActive: employee.isActive,
            createdAt: employee.createdAt,
        };
    },

    // UPDATE EMPLOYEE
    async updateEmployee(
        id: string,
        updateData: Partial<{
            name: string,
            role: 'admin' | 'employee';
        }>
    ) {
        const employee = await employeeRepository.findById(id);

        if(!employee) {
            throw new AppError('Employee not found', 404);
        }

        const updated = await employeeRepository.update(id, updateData);
        return updated;
    },

    // DEACTIVATE EMPLOYEE
    async deactivateEmployee(id: string, requesterId: string){
        const employee = await employeeRepository.findById(id);

        if(!employee){
            throw new AppError('Employee not found', 404);
        }

        //Admin khud ko deactivate nahi kar sakta 
        if(id === requesterId){
            throw new AppError('You cannot deactivate your owm account', 400);
        }

        await employeeRepository.deactivate(id);

        return { message:  'Employee deactivated successfully' };
    },

    //Reset Password
    async resetEmployeePassword(id: string){
        const employee = await employeeRepository.findById(id);

        if(!employee){
            throw new AppError('Employee not found', 404); 
        }

        // Random secure password generate karo
        // crypto Node.js ka built-in module hai
        // 8 bytes = 16 character hex string
        const newPassword = crypto.randomBytes(8).toString('hex');
        
        await employeeRepository.updatePassword(id, newPassword);

        // Plain password response mein bhejo —
        // Admin isse employee ko dega
        // Ek baar hi dikhega — baad mein hash stored hoga
        return {
            message: 'Password reset successfully',
            newPassword, // Admin ko dikhao taaki employee ko de sake
        };
    },

}

export default employeeService;