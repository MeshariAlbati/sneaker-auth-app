import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, X, Camera, Loader2, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import axios from 'axios';

interface PredictionResult {
  prediction: 'real' | 'fake';
  confidence: number;
  fake_probability: number;
  real_probability: number;
}

function App() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await axios.post<PredictionResult>(
        'http://localhost:8000/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setResult(response.data);
    } catch (err: any) {
      console.error('Prediction error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to analyze image. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
    setResult(null);
  };

  const getResultIcon = (prediction: string) => {
    switch (prediction) {
      case 'real':
        return <CheckCircle style={{ width: '48px', height: '48px', color: '#22c55e' }} />;
      case 'fake':
        return <XCircle style={{ width: '48px', height: '48px', color: '#ef4444' }} />;
      default:
        return <AlertTriangle style={{ width: '48px', height: '48px', color: '#eab308' }} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #f3f4f6' }}>
        <div className="container" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                <Shield style={{ width: '24px', height: '24px', color: '#2563eb' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0' }}>SneakerAuth</h1>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>AI-Powered Authentication</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ padding: '32px 20px', maxWidth: '1200px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Sneaker Authentication
          </h1>
          <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Upload a photo of your sneakers and our AI will determine if they're authentic or counterfeit
          </p>
        </motion.div>

        <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          {/* Upload Section */}
          <div className="card">
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Upload Sneaker Image</h2>
              <p style={{ color: '#6b7280' }}>
                Upload a clear photo of your sneakers for authentication analysis
              </p>
            </div>

            {!imagePreview ? (
              <div className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ padding: '16px', backgroundColor: '#dbeafe', borderRadius: '50%', marginBottom: '16px' }}>
                      <Camera style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                      Upload sneaker image
                    </h3>
                    <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '16px' }}>
                      Click to select your image
                    </p>
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      Supports: JPEG, PNG, WebP (max 10MB)
                    </div>
                  </div>
                </label>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', height: '256px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <button
                    onClick={handleRemoveImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      padding: '4px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                    disabled={isLoading}
                  >
                    <X style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Shield style={{ width: '20px', height: '20px' }} />
                        <span>Analyze Authenticity</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                    className="btn-secondary"
                    style={{ width: '100%' }}
                  >
                    Upload Different Image
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="card">
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Analysis Results</h2>
              <p style={{ color: '#6b7280' }}>
                AI-powered authentication results will appear here
              </p>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Loader2 style={{ width: '48px', height: '48px', color: '#2563eb', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    Analyzing Image...
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    Our AI is examining your sneaker for authenticity markers
                  </p>
                </div>
              </div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: result.prediction === 'real' ? '#bbf7d0' : '#fecaca',
                  backgroundColor: result.prediction === 'real' ? '#f0fdf4' : '#fef2f2',
                  padding: '24px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    {getResultIcon(result.prediction)}
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      color: result.prediction === 'real' ? '#166534' : '#991b1b'
                    }}>
                      {result.prediction === 'real' ? 'Authentic' : 'Counterfeit'}
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                      {result.prediction === 'real' 
                        ? 'This sneaker appears to be authentic based on our analysis'
                        : 'This sneaker shows signs of being counterfeit'
                      }
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: '600', color: '#111827' }}>Confidence Score</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                        <span style={{ fontWeight: 'bold', color: result.confidence >= 90 ? '#16a34a' : result.confidence >= 75 ? '#2563eb' : '#dc2626' }}>
                          {result.confidence >= 90 ? 'Very High' : result.confidence >= 75 ? 'High' : result.confidence >= 60 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '8px', height: '12px', marginBottom: '8px' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                          height: '12px',
                          borderRadius: '8px',
                          backgroundColor: result.prediction === 'real' ? '#22c55e' : '#ef4444'
                        }}
                      />
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                        {result.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#166534', fontWeight: '500', marginBottom: '4px' }}>
                        Authentic Probability
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d' }}>
                        {result.real_probability.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div style={{ backgroundColor: '#fef2f2', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#dc2626', fontWeight: '500', marginBottom: '4px' }}>
                        Counterfeit Probability
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#b91c1c' }}>
                        {result.fake_probability.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '50%', marginBottom: '16px' }}>
                    <AlertTriangle style={{ width: '48px', height: '48px', color: '#9ca3af' }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    Waiting for Analysis
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    Upload an image to get started with authentication
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
