import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-sky-100 fixed w-full top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <img src="/sneakers-icon.png" alt="LegitKicks" className="h-6 w-6" />
            </div>
            <div>
                      <h1 className="text-xl font-bold text-gray-900">LegitKicks</h1>
        <p className="text-sm text-gray-600">AI-Powered Authentication</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('upload-section')}
              className="text-gray-600 hover:text-sky-600 transition-colors font-medium"
            >
              Try It
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-sky-600 transition-colors font-medium"
            >
              How it works
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-600 hover:text-sky-600 transition-colors font-medium"
            >
              Contact
            </button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
