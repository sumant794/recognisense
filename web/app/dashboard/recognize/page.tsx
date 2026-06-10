'use client';
import { useState } from 'react';
import { aiApi } from '@/services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Camera, Upload, User, Package } from 'lucide-react';

export default function RecognizePage() {
  const [mode, setMode] = useState<'face' | 'product'>('product');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setResult(null);
    // Preview banao
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRecognize = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const endpoint = mode === 'face'
        ? '/face/recognize'
        : '/product/recognize';

      const res = await aiApi.post(endpoint, formData);
      setResult(res.data.data);

      if (res.data.data.recognized) {
        toast.success('Recognition successful!');
      } else {
        toast.error('Not recognized');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Recognition failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster />
      <h2 className="text-2xl font-bold text-white mb-6">Recognize</h2>

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => { setMode('product'); setResult(null); setPreview(null); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
            mode === 'product'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400'
          }`}
        >
          <Package size={18} /> Product
        </button>
        <button
          onClick={() => { setMode('face'); setResult(null); setPreview(null); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
            mode === 'face'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400'
          }`}
        >
          <User size={18} /> Face
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* Upload Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">
            Upload Image
          </h3>

          {/* Image Preview */}
          {preview ? (
            <div className="mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-700 rounded-lg h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <Camera className="mx-auto text-gray-600 mb-2" size={40} />
                <p className="text-gray-500">Upload an image</p>
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="recognize-image"
          />
          <label
            htmlFor="recognize-image"
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-lg cursor-pointer transition mb-3"
          >
            <Upload size={18} /> Choose Image
          </label>

          <button
            onClick={handleRecognize}
            disabled={!image || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Recognizing...' : `Recognize ${mode === 'face' ? 'Face' : 'Product'}`}
          </button>
        </div>

        {/* Result Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Result</h3>

          {!result ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Upload and recognize to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Status */}
              <div className={`p-4 rounded-lg ${
                result.recognized
                  ? 'bg-green-400/10 border border-green-400/20'
                  : 'bg-red-400/10 border border-red-400/20'
              }`}>
                <p className={`font-bold text-lg ${
                  result.recognized ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result.recognized ? '✅ Recognized!' : '❌ Not Recognized'}
                </p>
                <p className="text-gray-300 text-sm mt-1">{result.message}</p>
              </div>

              {/* Details */}
              {result.recognized && (
                <div className="space-y-3">
                  {mode === 'face' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Employee</span>
                        <span className="text-white font-medium">
                          {result.employee_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Employee ID</span>
                        <span className="text-white text-sm">
                          {result.employee_id}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Product</span>
                        <span className="text-white font-medium">
                          {result.product_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">SKU</span>
                        <span className="text-blue-400 font-medium">
                          {result.sku}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Confidence Bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">Confidence</span>
                      <span className="text-white text-sm">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}