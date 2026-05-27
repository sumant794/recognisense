import recognitionRepository from "../repositories/recognition.repository";
import productRepository from "../repositories/product.repository";
import AppError from "../utils/AppError";    

const recognitionService = {
    // CREATE RECORD
    // AI service call karega yeh
    async createRecord(data: {
        scannedBy: string;
        productSku?: string,   // SKU se product dhundenge
        confidence: number;
        status: 'success' | 'failed';
        imageUrl?: string;
        notes?: string;
    }) {
        let productId: string | undefined;

        // SKU se product ID dhundo
        if(data.productSku && data.status === 'success'){
            const product = await productRepository.findBySku(data.productSku);

            if(!product){
                throw new AppError(`Product with SKU ${data.productSku} not found`, 404);
            }

            productId = product._id.toString();
        }

        const record = await recognitionRepository.create({
            scannedBy: data.scannedBy,
            product: productId,
            confidence: data.confidence,
            status: data.status,
            imageUrl: data.imageUrl,
            notes: data.notes,
        });

        // Product details ke saath return karo
        return await recognitionRepository.findById(
            record._id.toString()
        );
    },

    // GET ALL — Admin
    async getAllRecords(limit?: number){
        return await recognitionRepository.findAll(limit);
    },

    // GET MY HISTORY — Employee
    async getMyHistory(employeeId: string, limit?:number) {
        return await recognitionRepository.findByEmployee(
            employeeId,
            limit
        );
    },

    // GET PRODUCT HISTORY
    async getProductHistory(productId: string) {
        return await recognitionRepository.findByProduct(productId);   
    },

    // ANALYTICS
    async getDashboardStats(employeeId?: string) {
        const todayStats = await recognitionRepository.getTodayStats();

        let employeeStats;
        if(employeeId){
            employeeStats = await recognitionRepository.getEmployeeStats(
                employeeId
            );
        }  

        return {
            today: todayStats,
            employee: employeeStats    
        };
    },
};

export default recognitionService;
