import User, {IUser} from '../models/User';

const authRepository = {
    //Find user by Email
    async findByEmail(email: string): Promise<IUser | null>{
        return await User.findOne({ email })
            .select('+password +refreshToken');
    },

    //FInd user by id
    async findById(id: string): Promise <IUser | null> {
        return await User.findById(id);
    },

    //Create new user
    async createUser(userData: {
        name: string;
        email: string;
        password: string;
        role?: 'admin' | 'employee';
    }): Promise <IUser> {
        const user = new User(userData);
         // .save() call hoga →
        // pre('save') middleware chalega →
        // password hash hoga →
        // database mein save hoga
        return await user.save();
    },

    //Save Refresh Token With User
    async saveRefreshToken(
        userId: string,
        refreshToken: String
    ): Promise<void>{
        await User.findByIdAndUpdate(userId, { refreshToken });
    },

    //Remove refresh token when logout
    async clearRefreshToken(userId: string): Promise<void>{
        await User.findByIdAndUpdate(userId, {refreshToken: ''});
    },

    //Find User by refreshToken for verification 
    async findByRefreshToken(refreshToken: string): Promise<IUser | null >{
        return await User.findOne({ refreshToken })
            .select('+refreshToken');
    },

};

export default authRepository;
