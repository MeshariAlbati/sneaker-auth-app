import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Send, MapPin, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create a mailto link and open it
    const subject = encodeURIComponent(`SneakerAuth Contact: ${formData.subject}`);
    const body = encodeURIComponent(
      `Hi Meshari,\n\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Subject: ${formData.subject}\n\n` +
      `Message:\n${formData.message}\n\n` +
      `---\nSent from SneakerAuth contact form`
    );
    const mailtoLink = `mailto:Meshari.albati@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
    
    // Store the message data as backup
    const messageData = {
      timestamp: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };
    
    const existingMessages = JSON.parse(localStorage.getItem('sneaker_messages') || '[]');
    existingMessages.push(messageData);
    localStorage.setItem('sneaker_messages', JSON.stringify(existingMessages));
    
    // Show success
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-white to-sky-50">
      <div className="container-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our AI authentication service? Found an issue or want to provide feedback? 
            We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sky-100 rounded-lg">
                    <Mail className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">Meshari.albati@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sky-100 rounded-lg">
                    <Phone className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">+966 55 332 3624</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sky-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Location</h4>
                    <p className="text-gray-600">Khobar, Saudi Arabia</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-sky-100 rounded-lg">
                    <Clock className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Response Time</h4>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200">
              <h3 className="text-xl font-bold text-sky-900 mb-4">Current Support & Common Issues</h3>
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-4">
                <p className="text-blue-800 font-semibold text-sm">
                  ⚠️ Currently supports only <span className="font-bold">Nike Jordan 1</span> and <span className="font-bold">Nike Air Force 1</span> authentication
                </p>
              </div>
              <ul className="space-y-3 text-sky-800">
                <li className="flex items-start space-x-2">
                  <span className="text-sky-600 mt-1">•</span>
                  <span>Other Nike models - not yet supported, coming soon</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sky-600 mt-1">•</span>
                  <span>Low confidence scores - try better lighting or different angles</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sky-600 mt-1">•</span>
                  <span>Upload errors - ensure image is under 10MB and in supported format</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-sky-600 mt-1">•</span>
                  <span>Professional verification - we recommend it for high-value items</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="card">
              {!isSubmitted ? (
                <>
                  <div className="flex items-center space-x-3 mb-6">
                    <MessageSquare className="h-6 w-6 text-sky-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Send us a message</h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors resize-none"
                        placeholder="Tell us about your issue, question, or feedback..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Prepared!</h3>
                  <p className="text-gray-600">
                    Thank you for contacting us! Your email client should have opened with a pre-filled message to Meshari.albati@gmail.com. 
                    Simply hit send in your email client to deliver your message.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    If your email client didn't open, please email us directly at Meshari.albati@gmail.com
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
