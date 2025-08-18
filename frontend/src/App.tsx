import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageUpload from './components/ImageUpload';
import ResultDisplay from './components/ResultDisplay';
import Header from './components/Header';
import Hero from './components/Hero';
import Contact from './components/Contact';
import type { PredictionResult } from './types';

function App() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredictionComplete = (prediction: PredictionResult) => {
    setResult(prediction);
    setIsLoading(false);
  };

  const handlePredictionStart = () => {
    setIsLoading(true);
    setResult(null);
  };

  const handleReset = () => {
    setResult(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with App Explanation */}
      <Hero />
      
      {/* Tips Section */}
      <section className="section-padding bg-gradient-to-b from-white to-sky-50">
        <div className="container-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="card bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Tips for Best Results
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Good Lighting</h4>
                      <p className="text-gray-600 text-sm">Use natural light or bright indoor lighting for clearer photos</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Clear Focus</h4>
                      <p className="text-gray-600 text-sm">Ensure the image is sharp and not blurry</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Multiple Angles</h4>
                      <p className="text-gray-600 text-sm">Try different angles if you get low confidence scores</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Full View</h4>
                      <p className="text-gray-600 text-sm">Capture the entire Jordan 1 or Air Force 1 including logos and key details</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Upload Section */}
      <section id="upload-section" className="section-padding bg-gradient-to-b from-sky-50 to-cyan-50">
        <div className="container-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Authenticate Your Sneakers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload a clear photo of your <span className="font-semibold text-sky-700">Nike Jordan 1</span> or <span className="font-semibold text-sky-700">Nike Air Force 1</span> sneakers and our AI will analyze them for authenticity markers. 
              Get instant results with detailed confidence scores.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ImageUpload
                onPredictionStart={handlePredictionStart}
                onPredictionComplete={handlePredictionComplete}
                isLoading={isLoading}
                onReset={handleReset}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ResultDisplay result={result} isLoading={isLoading} />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container-center">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 SneakerAuth. AI-powered sneaker authentication technology.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Results are for informational purposes. Professional authentication recommended for high-value items.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;