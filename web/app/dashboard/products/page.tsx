'use client';
import { useEffect, useState } from 'react';
import { productsAPI, aiAPI } from '@/services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Trash2, Camera, Package } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [registerModal, setRegisterModal] = useState<any>(null);
  const [aiImage, setAiImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
  });

  const fetchProducts = async () => {
    try {
      const res = await productsAPI.getAll();
      setProducts(res.data.data.products);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productsAPI.create(form);
      toast.success('Product created!');
      setShowModal(false);
      setForm({ name: '', description: '', category: '' });
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted!');
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleRegisterAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiImage || !registerModal) return;

    try {
      const formData = new FormData();
      formData.append('product_id', registerModal._id);
      formData.append('product_name', registerModal.name);
      formData.append('sku', registerModal.sku);
      formData.append('image', aiImage);

      await aiAPI.registerProduct(formData);
      toast.success('Product registered for AI!');
      setRegisterModal(null);
      setAiImage(null);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'AI registration failed');
    }
  };

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Products</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="mx-auto text-gray-700 mb-4" size={48} />
          <p className="text-gray-400">No products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white font-semibold">{p.name}</h3>
                  <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">
                    {p.sku}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-gray-600 hover:text-red-400 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-3">{p.description}</p>
              <p className="text-gray-500 text-xs mb-4">
                Category: {p.category}
              </p>
              <button
                onClick={() => setRegisterModal(p)}
                className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-sm transition"
              >
                <Camera size={14} /> Register for AI
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-4">Add Product</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <input
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register for AI Modal */}
      {registerModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-1">
              Register for AI
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {registerModal.name} — {registerModal.sku}
            </p>
            <form onSubmit={handleRegisterAI} className="space-y-3">
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAiImage(e.target.files?.[0] || null)}
                  className="hidden"
                  id="ai-image"
                />
                <label htmlFor="ai-image" className="cursor-pointer">
                  {aiImage ? (
                    <p className="text-green-400">{aiImage.name}</p>
                  ) : (
                    <p className="text-gray-400">Click to upload product photo</p>
                  )}
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setRegisterModal(null); setAiImage(null); }}
                  className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!aiImage}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:opacity-50"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}