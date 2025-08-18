import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Loader2, TrendingUp } from 'lucide-react';
import type { PredictionResult } from '../types';

interface ResultDisplayProps {
  result: PredictionResult | null;
  isLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
  const getResultIcon = (prediction: string) => {
    switch (prediction) {
      case 'real':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'fake':
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
    }
  };

  const getResultColor = (prediction: string) => {
    switch (prediction) {
      case 'real':
        return 'text-green-600';
      case 'fake':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getResultBgColor = (prediction: string) => {
    switch (prediction) {
      case 'real':
        return 'bg-green-50 border-green-200';
      case 'fake':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return { level: 'Very High', color: 'text-green-600' };
    if (confidence >= 75) return { level: 'High', color: 'text-blue-600' };
    if (confidence >= 60) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-red-600' };
  };

  return (
    <div className="card h-fit">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Results</h2>
        <p className="text-gray-600">
          AI-powered authentication results will appear here
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="text-center py-12"
          >
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-sky-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analyzing Image...
              </h3>
              <p className="text-gray-600">
                Our AI is examining your sneaker for authenticity markers
              </p>
            </div>
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`rounded-lg border-2 p-6 mb-6 ${getResultBgColor(result.prediction)}`}>
              <div className="flex items-center justify-center mb-4">
                {getResultIcon(result.prediction)}
              </div>
              
              <div className="text-center">
                <h3 className={`text-2xl font-bold mb-2 ${getResultColor(result.prediction)}`}>
                  {result.prediction === 'real' ? 'Authentic' : 'Counterfeit'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {result.prediction === 'real' 
                    ? 'This sneaker appears to be authentic based on our analysis'
                    : 'This sneaker shows signs of being counterfeit'
                  }
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">Confidence Score</span>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-600" />
                    <span className={`font-bold ${getConfidenceLevel(result.confidence).color}`}>
                      {getConfidenceLevel(result.confidence).level}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-3 rounded-full ${
                      result.prediction === 'real' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </div>
                
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {result.confidence.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-green-600 font-medium mb-1">
                    Authentic Probability
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {result.real_probability.toFixed(1)}%
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-red-600 font-medium mb-1">
                    Counterfeit Probability
                  </div>
                  <div className="text-xl font-bold text-red-700">
                    {result.fake_probability.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📝 Analysis Notes</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Results are based on AI analysis of visual features</li>
                  <li>• Higher confidence scores indicate more reliable predictions</li>
                  <li>• Consider professional authentication for valuable items</li>
                  {result.confidence < 70 && (
                    <li className="text-orange-600 font-medium">
                      • Low confidence - consider retaking photo with better lighting
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-12"
          >
            <div className="flex flex-col items-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <AlertTriangle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Waiting for Analysis
              </h3>
              <p className="text-gray-600">
                Upload an image to get started with authentication
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultDisplay;
