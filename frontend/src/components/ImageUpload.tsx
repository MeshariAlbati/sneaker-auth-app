import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Camera, Loader2, Shield } from 'lucide-react';
import axios from 'axios';
import config from '../config';
import type { PredictionResult } from '../types';

interface ImageUploadProps {
  onPredictionStart: () => void;
  onPredictionComplete: (result: PredictionResult) => void;
  isLoading: boolean;
  onReset: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onPredictionStart,
  onPredictionComplete,
  isLoading,
  onReset,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    onPredictionStart();
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await axios.post<PredictionResult>(
        `${config.apiUrl}/predict`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      onPredictionComplete(response.data);
    } catch (err: unknown) {
      console.error('Prediction error:', err);
      const errorMessage = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to analyze image. Please try again.';
      setError(errorMessage);
      onReset();
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
    onReset();
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Sneaker Image</h2>
        <p className="text-gray-600">
          Upload a clear photo of your <span className="font-semibold text-sky-700">Nike Jordan 1</span> or <span className="font-semibold text-sky-700">Nike Air Force 1</span> for authentication analysis
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!imagePreview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              {...getRootProps()}
              className={`upload-area cursor-pointer ${isDragActive ? 'dragover' : ''}`}
            >
              <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <div className="p-4 bg-sky-100 rounded-full mb-4">
                {isDragActive ? (
                  <Upload className="h-8 w-8 text-sky-600" />
                ) : (
                  <Camera className="h-8 w-8 text-sky-600" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragActive ? 'Drop your image here' : 'Upload Nike Jordan 1 / Air Force 1'}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Drag and drop your image here, or click to select
              </p>
              <div className="text-sm text-gray-500">
                Supports: JPEG, PNG, WebP (max 10MB)
              </div>
            </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Analyze Authenticity</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleRemoveImage}
                disabled={isLoading}
                className="btn-secondary"
              >
                Upload Different Image
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-600 text-sm">{error}</p>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUpload;
