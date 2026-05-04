import authRepository from "../repositories/auth.repository";
import AppError from "../utils/AppError";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../utils/token';

const authService = {
    //Register
    async register(data: {
        name: string;
        email: string;
        password: string;
        role?: 'admin' | 'employee';
    }) {
        //Check if email already exists 
        const existingUser = await authRepository.findByEmail(data.email);

        if(existingUser){
            //AppError --> central error handler pakdega
            throw new AppError('Email already registered', 400);
        }

        //Create User 
        // Password yahan plain text hai →
        // Model ka pre('save') middleware hash karega
        const user = await authRepository.createUser(data);

        //Make tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        //Save RefreshToken in Database
        await authRepository.saveRefreshToken(
            user._id.toString(),
            refreshToken
        );

        //return user 
        //Do not send password in response 

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    },

    //Login

    async login(data: {email: string; password: string}){
        //Step 1 : find user
        const user = await authRepository.findByEmail(data.email);
        // User nahi mila ya password galat —
        // Dono ke liye same error do →
        // Security: attacker ko pata na chale
        // "email exist karta hai ya nahi"
        if(!user || !(await user.comparePassword(data.password))){
            throw new AppError('Invalid email or password', 401);
        }

        // Step 2: Account active hai?
        if(!user.isActive) {
            throw new AppError('Your account has been deactivated', 403);
        }

        //Step3: tokens banao
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Step 4: Naya refresh token save karo
        await authRepository.saveRefreshToken(
            user._id.toString(),
            refreshToken
        );

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    },

    //Refresh Token
    async refreshToken(token: string){
        //Step 1: Token Valid hai? (JWT Verify)
        let payload;
        try {
            payload = verifyRefreshToken(token);
        } catch {
            throw new AppError('Invalid or expired refrsh token', 401);
        }

        //Step 2: Database me yeh token exist karta hai ?
        const user = await authRepository.findByRefreshToken(token);

        if(!user){
            throw new AppError('Invalid refresh token', 401);
        }

        //Step3: Naya Access token do
        const accessToken = generateAccessToken(user);
        return { accessToken };
    },

    //LogOut
    async logout(userId: string){
        //Database se refresh token hatao
        await authRepository.clearRefreshToken(userId);
        return { message: 'Logged out successfully' };
    },

};

export default authService;