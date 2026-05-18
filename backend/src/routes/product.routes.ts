import { Router } from 'express';
import productController from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import {
  createProductSchema,
  updateProductSchema,
} from '../utils/validation';

const router = Router();

// Saare product routes pe authenticate lagao
// Matlab login ke bina koi bhi product nahi dekh sakta
router.use(authenticate);

// GET /api/products/search?q=query
// Search route pehle hona chahiye /:id se
// Warna "search" ko ID samjh lega Express
router.get('/search', productController.searchProducts);

// GET /api/products/category/:category
router.get('/category/:category', productController.getByCategory);

// GET /api/products → Saare products (admin + employee)
router.get('/', productController.getAllProducts);

// GET /api/products/:id → Ek product
router.get('/:id', productController.getProductById);

// POST /api/products → Naya product (sirf admin)
router.post(
  '/',
  authorize('admin'),
  validate(createProductSchema),
  productController.createProduct
);

// PATCH /api/products/:id → Update (sirf admin)
router.patch(
  '/:id',
  authorize('admin'),
  validate(updateProductSchema),
  productController.updateProduct
);

// DELETE /api/products/:id → Delete (sirf admin)
router.delete(
  '/:id',
  authorize('admin'),
  productController.deleteProduct
);

export default router;