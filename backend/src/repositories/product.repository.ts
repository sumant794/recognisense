import Product, { IProduct } from '../models/Product';

const productRepository = {

  // Naya product banao
  async create(productData: {
    name: string;
    description: string;
    category: string;
    sku: string;
    createdBy: string;
  }): Promise<IProduct> {
    const product = new Product(productData);
    return await product.save();
  },

  // Saare active products lo
  // populate('createdBy') →
  // createdBy ID ki jagah
  // us admin ka naam aur email aayega
  async findAll(): Promise<IProduct[]> {
    return await Product.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }); // Naye pehle
  },

  // ID se ek product dhundo
  async findById(id: string): Promise<IProduct | null> {
    return await Product.findById(id)
      .populate('createdBy', 'name email');
  },

  // SKU se product dhundo
  // AI service use karega recognition ke baad
  async findBySku(sku: string): Promise<IProduct | null> {
    return await Product.findOne({ sku, isActive: true });
  },

  // Product update karo
  async update(
    id: string,
    updateData: Partial<{
      name: string;
      description: string;
      category: string;
      sku: string;
      isActive: boolean;
    }>
  ): Promise<IProduct | null> {
    // new: true → updated document return karo
    // runValidators → schema validation dobara chale
    return await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
  },

  // Image add karo product mein
  async addImage(
    id: string,
    imageUrl: string
  ): Promise<IProduct | null> {
    // $push → array mein element add karo
    return await Product.findByIdAndUpdate(
      id,
      { $push: { images: imageUrl } },
      { new: true }
    );
  },

  // Soft delete — isActive false karo
  async softDelete(id: string): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  },

  // Category ke saare products
  async findByCategory(category: string): Promise<IProduct[]> {
    return await Product.find({
      category,
      isActive: true
    }).sort({ createdAt: -1 });
  },

  // Text search — name ya description mein dhundo
  async search(query: string): Promise<IProduct[]> {
    return await Product.find({
      $text: { $search: query },
      isActive: true,
    }).sort({ createdAt: -1 });
  },

};

export default productRepository;