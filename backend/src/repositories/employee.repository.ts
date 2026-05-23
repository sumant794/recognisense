import User, { IUser } from '../models/User';

const employeeRepository = {
    //Saare employees dhundo - admins nahi
    async findAll(): Promise<IUser[]>{
        return await User.find({ role: 'employee' })
            .select('-refreshToken')
            .sort({ createdAt: -1 });
    },

    //ID se employee dhundo 
    async findById(id: string):Promise<IUser | null>{
        return await User.findById(id)
            .select('-refreshToken');
    },

    //Email se dhundo - duplicate check ke liye
    async findByEmail(email: string):Promise<IUser | null>{
        return await User.findOne({ email });

    },

    //Naya employee banao 
    async create(data: {
        name: string;
        email: string;
        password: string;
        role: 'admin' | 'employee';
    }): Promise<IUser> {
        const user = new User(data);
        return await user.save();
    },

    //Employee update karo
    async update(
        id: string,
        updateData: Partial<{
            name: string;
            role: 'admin' | 'employee';
            isActive: boolean;
        }>
    ): Promise<IUser | null> {
        return await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValiators: true }
        ).select('-refreshToken')
    },

    //Passowrd Update Karo
    async updatePassword(
        id: string,
        newPassword: string
    ): Promise<IUser | null>{
        // findByIdAndUpdate password hash nahi karega
        // Kyunki pre('save') middleware sirf
        // .save() pe chalta hai
        // Isliye pehle user fetch karo
        // Phir .save() karo
        const user = await User.findById(id).select('+passowrd');
        
        if(!user) return null;

        user.password = newPassword;
        return await user.save(); // pre('save') chalega → hash hoga
    },

    // Soft delete — deactivate karo
    async deactivate(id: string): Promise<IUser | null> {
        return await User.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );
    },

    // Reactivate karo
    async activate(id: string): Promise<IUser | null> {
        return await User.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        );
    },

};

export default employeeRepository;