import { Request, Response, NextFunction } from 'express';
import productService from '../services/product.service';

const productController = {

  // POST /api/products
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user auth middleware ne set kiya tha
      const product = await productService.createProduct({
        ...req.body,
        createdBy: req.user!.userId,
      });

      res.status(201).json({
        status: 'success',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/products
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getAllProducts();

      res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/products/:id
  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id as string);

      res.status(200).json({
        status: 'success',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/products/:id
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.updateProduct(
        req.params.id as string,
        req.body,
        req.user!.userId,
        req.user!.role
      );

      res.status(200).json({
        status: 'success',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/products/:id
  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.deleteProduct(
        req.params.id as string,
        req.user!.role
      );

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/products/search?q=query
  async searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // Query string se search term nikalo
      const query = req.query.q as string;
      const products = await productService.searchProducts(query);

      res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/products/category/:category
  async getByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getProductsByCategory(
        req.params.category as string
      );

      res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  },

};

export default productController;