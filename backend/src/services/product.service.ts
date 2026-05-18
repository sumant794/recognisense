import productRepository from "../repositories/product.repository";
import AppError from "../utils/AppError";

const productService = {
    // CREATE PRODUCT
    async createProduct(data: {
        name:string,
        description:string,
        category:string,
        sku:string,
        createdBy:string,
    }) {
        //SKU already exist karta hai?
        const existingProduct = await productRepository.findBySku(data.sku);
        
        if(existingProduct) {
            throw new AppError(`SKU ${data.sku} already exists`, 400);
        }
        
        const product = await productRepository.create(data);

        return product;
    },

    //GET ALL PRODUCTS
    async getAllProducts(){
        const products = await productRepository.findAll();
        return products;
    },

    //GET SINGLE PRODUCT
    async getProductById(id:string){
        const product = await productRepository.findById(id);

        if(!product) {
            throw new AppError('Product not found', 404);
        }

        return product;
    },

    //UPDATE PRODUCT
    async updateProduct(
        id:string,
        updateData: Partial<{
            name: string;
            description : string;
            category: string;
            sku: string;
        }>,
        requesterId: string,
        requesterRole: string
    ) {
        //Product exist karta hai
        const product = await productRepository.findById(id);

        if(!product){
            throw new AppError('Product not found', 404);
        }

        //Sirf Admin update kar sakta hai 
        if(requesterRole !== 'admin'){
            throw new AppError('Only admins can update products', 403);
        }

        //Agar sku change ho raha hai
        //Naya sku already kisi aur product ka nahi hona chahiye
        if(updateData.sku){
            const skuExists = await productRepository.findBySku(updateData.sku);
            
            //sku exist hai aur is product ka nahi hai 
            if(skuExists && skuExists._id.toString()!== id){
                throw new AppError(`Sku ${updateData.sku} already exists`, 400);
            }
        }

        const updatedProduct = await productRepository.update(id, updateData);
        return updatedProduct
    },

    //DELETE PRODUCT
    async deleteProduct(id: string, requesterRole: string) {
        //Product exist karta hai 
        const product = await productRepository.findById(id);

        if(!product){
            throw new AppError('Product not found', 404)
        }

        //Sirf admin delete kar sakta hai
        if(requesterRole !== 'admin'){
            throw new AppError('Only admins can delete products', 403)
        }

        await productRepository.softDelete(id);

        return { message: 'Product deleted successfully'};
    },

    //ADD IMAGE
    async addProductImage(id:string, imageUrl: string) {
        const product = await productRepository.findById(id);

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        //Maximum 10 images per product
        if(product.images.length >= 10){
            throw new AppError(
                'Maximum 10 images allowed per product',
                400
            );
        }

        const updatedProduct = await productRepository.addImage(id, imageUrl);

        return updatedProduct;
    },

    //Search Products
    async searchProducts(query: string){
        if(!query || query.trim().length < 2){
            throw new AppError(
                'Search query must be at least 2 characters',
                400
            );
        }

        const products = await productRepository.search(query);

        return products;
    },

    //GET BY CATEGORY
    async getProductsByCategory(category: string) {
        const products = await productRepository.findByCategory(category);
        return products;
    },

};

export default productService;