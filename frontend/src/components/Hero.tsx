import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Eye, CheckCircle, ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    uploadSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="section-hero section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-blue-500/20 to-cyan-500/20" />
        <div className="container-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold">SneakerAuth</h1>
            </div>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              AI-Powered Sneaker Authentication
            </p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl mb-12 text-white/80 max-w-4xl mx-auto leading-relaxed"
            >
              Protect yourself from counterfeit sneakers with our advanced AI technology. 
              Currently supports <span className="font-semibold text-white">Nike Jordan 1</span> and <span className="font-semibold text-white">Nike Air Force 1</span> authentication.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onClick={scrollToUpload}
              className="inline-flex items-center space-x-2 bg-white text-sky-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Try It Now</span>
              <ArrowDown className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-white">
        <div className="container-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How SneakerAuth Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our specialized AI model analyzes Nike Jordan 1 and Nike Air Force 1 sneakers, 
              examining thousands of visual markers to determine authenticity with high accuracy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="p-4 bg-sky-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Zap className="h-10 w-10 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your sneaker photo and get results in seconds. Our AI processes images 
                instantly without compromising on accuracy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="p-4 bg-sky-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Eye className="h-10 w-10 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced AI Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                Our neural network analyzes stitching patterns, materials, logos, and hundreds 
                of other visual markers that distinguish authentic sneakers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="p-4 bg-sky-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Confidence Scoring</h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed confidence scores and probability breakdowns to understand 
                how certain our AI is about the authentication result.
              </p>
            </motion.div>
          </div>

          {/* Step-by-step Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200"
          >
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Three Simple Steps
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Upload Image</h4>
                <p className="text-gray-600">
                  Take a clear photo of your Nike Jordan 1 or Air Force 1 sneakers or upload an existing image. 
                  Our system supports JPEG, PNG, and WebP formats up to 10MB.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">AI Analysis</h4>
                <p className="text-gray-600">
                  Our specialized machine learning model analyzes Nike Jordan 1 and Air Force 1 features, examining 
                  stitching, materials, logos, and other details to detect authenticity markers.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Get Results</h4>
                <p className="text-gray-600">
                  Receive instant results with confidence scores, probability breakdowns, 
                  and detailed analysis notes to help you make informed decisions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;
