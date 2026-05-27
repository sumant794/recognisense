import Recognition, { IRecognition } from "../models/Recognition";

const recognitionRepository = {
    //Naya recoginiton record banao
    async create(data: {
        scannedBy: string;
        product?: string;
        confidence: number;
        status: 'success'|'failed';
        imageUrl?: string;
        notes?: string;
    }): Promise<IRecognition>{
        const recognition  = new Recognition(data);
        return await recognition.save();
    },

    // Saare records — admin ke liye
    async findAll(limit: number = 50 ): Promise<IRecognition[]> {
        return await Recognition.find()
            .populate('scannedBy', 'name email ')
            .populate('product', 'name sku category')
            .sort({ createdAt: -1 })
            .limit(limit);
    },
    
    //Ek employee ke records 
    async findByEmployee(
        employeeId: string,
        limit: number = 50
    ): Promise<IRecognition[]>{
        return await Recognition.find({ scannedBy: employeeId })
            .populate('scannedBy', 'name email')
            .populate('product', 'name sku category')
            .sort({ createdAt: -1 })
            .limit(limit);
    },

    // Ek product ke saare scans
    async findByProduct(productId: string): Promise<IRecognition[]>{
        return await Recognition.find({ product: productId })
            .populate('scannedBy', 'name email')
            .populate('proudct', 'name sku category')
            .sort({ createdAt: -1 });
    },

    //ID se ke record
    async findById(id: string):Promise<IRecognition | null>{
        return await Recognition.findById(id)
            .populate('scannedBy', 'name email')
            .populate('product', 'sku category');
    },

    //Anlaytics - Employee ke stats
    async getEmployeeStats(employeeId: string){
        return await Recognition.aggregate([
            //Sirf is employee ke records
            { $match: { scannedBy: new Recognition.base.Types.ObjectId(employeeId) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1},
                    avgConfidence: { $avg: '$confidence'},
                },
            },
        ]);
    },

    //Analytics aaj ke saare scans
    async getTodayStats(){
        const today = new Date();
        today.setHours(0,0,0,0);

        return await Recognition.aggregate([
            {
                $match: {
                    createdAt: { $gte: today},
                },
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1},
                },
            },
        ]);
    },
    
};

export default recognitionRepository;