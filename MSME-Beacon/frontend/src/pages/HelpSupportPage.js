import React, { useState } from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5 
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqCategories = [
    { id: 'all', name: 'All FAQs' },
    { id: 'account', name: 'Account' },
    { id: 'business', name: 'Business Information' },
    { id: 'prediction', name: 'Risk Prediction' },
    { id: 'data', name: 'Data Input' },
    { id: 'technical', name: 'Technical Issues' }
  ];

  const faqs = [
    {
      id: 1,
      question: 'What is MSME Risk Predictor?',
      answer: 'The MSME Risk Predictor is an AI-powered tool that helps micro, small, and medium enterprises assess their business risk and identify areas for improvement. It analyzes your business data using machine learning to provide insights on risk levels and actionable recommendations.',
      category: 'all'
    },
    {
      id: 2,
      question: 'How accurate are the risk predictions?',
      answer: 'Our prediction model has been trained on extensive datasets of MSME performance. While no prediction is 100% accurate, our model typically achieves high accuracy when validated against historical data. We continuously improve our algorithms as more data becomes available.',
      category: 'prediction'
    },
    {
      id: 3,
      question: 'What business data do I need to input for a prediction?',
      answer: 'For a risk prediction, you\'ll need to input key business metrics such as monthly sales, stock value, number of customers, monthly expenses, monthly profit, number of employees, average transaction value, return rate, and marketing spend. The more accurate your input data, the better the prediction quality.',
      category: 'data'
    },
    {
      id: 4,
      question: 'Is my business data secure?',
      answer: 'Yes, we take data security very seriously. All your business information is encrypted both during transmission and storage. We comply with industry standard security practices and never share your specific business data with third parties without your explicit consent.',
      category: 'account'
    },
    {
      id: 5,
      question: 'How do I interpret my risk prediction results?',
      answer: 'Your risk prediction results include several key components: (1) The risk score (0-100) indicates the level of business risk, with higher numbers indicating greater risk; (2) The risk classification (Low, Medium, High) provides a simple categorization; (3) Key risk factors identify specific areas affecting your risk score; (4) Recommendations offer actionable steps to reduce risk in each identified area.',
      category: 'prediction'
    },
    {
      id: 6,
      question: 'How do I upload a CSV file for bulk predictions?',
      answer: 'To upload a CSV file, go to the Risk Prediction page and select the "CSV Upload" tab. Your CSV file must include columns for the required business metrics (monthly_sales, stock_value, etc.). Click on "Process CSV" to upload your file and get predictions for all records. Make sure your CSV format matches our template, which you can download from the upload page.',
      category: 'data'
    },
    {
      id: 7,
      question: 'The application is running slowly. What can I do?',
      answer: 'If you\'re experiencing performance issues, try clearing your browser cache and cookies, ensure you\'re using the latest version of your browser, and check your internet connection. If problems persist, please contact our support team with details about your device and browser.',
      category: 'technical'
    },
    {
      id: 8,
      question: 'What should I do if my business is identified as high risk?',
      answer: 'If your business is identified as high risk, don\'t panic. The system provides specific recommendations for each risk factor identified. Focus on addressing the highest impact factors first. Review the detailed recommendations page, which provides actionable steps to improve in each area. Consider consulting with a business advisor for personalized guidance based on the analysis.',
      category: 'prediction'
    },
    {
      id: 9,
      question: 'What format should my CSV file be in?',
      answer: 'Your CSV file should include the following columns: monthly_sales, stock_value, num_customers, monthly_expenses, monthly_profit, num_employees, avg_transaction_value, return_rate, and marketing_spend. The first row should be the header row with these exact column names. Each subsequent row should contain numeric values for a single business or time period.',
      category: 'data'
    },
    {
      id: 10,
      question: 'How often should I update my risk prediction?',
      answer: 'We recommend updating your risk prediction at least quarterly, or whenever significant changes occur in your business metrics or market conditions. Regular updates will help you track your progress and adjust your strategy accordingly. Businesses experiencing rapid growth or facing challenges may benefit from more frequent assessments.',
      category: 'prediction'
    },
    {
      id: 11,
      question: 'Can I export or share my prediction results?',
      answer: 'Yes, you can export your prediction results in several formats including PDF, CSV, and Excel. On the results page, look for the "Export" button to download your data. You can also share results directly via email by using the "Share" option and entering recipient email addresses.',
      category: 'technical'
    },
    {
      id: 12,
      question: 'What do the different sections of the dashboard show?',
      answer: 'The dashboard provides an overview of your business risk profile. The Risk Score shows your current risk level. Risk Factors highlights the key areas affecting your score. Trend Analysis shows how your risk has changed over time. Recommendations provides actionable steps to improve. Insights offers deeper analysis of your business data patterns and comparisons to industry benchmarks.',
      category: 'prediction'
    }
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmitContactForm = (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API endpoint
    console.log('Submitting contact form:', contactForm);
    
    // Simulate API call
    setTimeout(() => {
      setFormSubmitted(true);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const filteredFaqs = faqs.filter(faq => {
    // Filter by search query
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Framer motion variants for FAQ accordion
  const accordionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer} 
        className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeIn} className="mb-8">
          <h1 className="text-3xl font-bold gradient-heading">Help & Support</h1>
          <p className="mt-2 text-gray-600">
            Find answers to frequently asked questions or connect with our support team for personalized assistance.
          </p>
        </motion.div>
        
        {/* Search Bar */}
        <motion.div 
          variants={fadeIn}
          className="card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="input py-3 pl-10 pr-4"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="hidden sm:block text-sm text-gray-500">
              <span className="font-medium text-blue-600">{filteredFaqs.length}</span> results found
            </div>
          </div>
        </motion.div>
        
        {/* FAQ Categories */}
        <motion.div 
          variants={fadeIn}
          className="mb-6"
        >
          <div className="sm:hidden">
            <label htmlFor="category-select" className="sr-only">Select a category</label>
            <select
              id="category-select"
              className="input"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {faqCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="flex flex-wrap gap-2">
              {faqCategories.map(category => (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                  whileTap={{ y: 0 }}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* FAQs */}
        <motion.div 
          variants={fadeIn}
          className="card mb-10"
        >
          <h2 className="text-xl font-semibold mb-6 gradient-heading">Frequently Asked Questions</h2>
          
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <FAQ key={faq.id} faq={faq} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or category selection.
              </p>
            </div>
          )}
        </motion.div>
        
        {/* Contact Support */}
        <motion.div variants={fadeIn} className="card mb-10">
          <h2 className="text-xl font-semibold mb-4 gradient-heading">Contact Support</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          
          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-md bg-green-50 p-4 border border-green-200"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Message Sent</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Thank you for reaching out. Our support team will get back to you within 24 hours.</p>
                  </div>
                  <div className="mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => setFormSubmitted(false)}
                    >
                      Send another message
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmitContactForm}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                    className="input"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    className="input"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    value={contactForm.subject}
                    onChange={handleContactFormChange}
                    className="input"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    className="input"
                    placeholder="Please provide as much detail as possible about your issue or question..."
                  />
                </div>
              </div>

              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn btn-primary"
                >
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Message
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
        
        {/* Additional Support Options */}
        <motion.div variants={fadeIn} className="mb-10">
          <h2 className="text-xl font-semibold mb-6 gradient-heading">Contact Methods</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Email Support */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
              className="card p-6 bg-gradient-to-br from-white to-blue-50"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-3 shadow-md">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Email Support</h3>
                  <p className="mt-2 text-gray-600">
                    Send us an email directly
                  </p>
                  <a href="mailto:support@msmepredictor.com" className="mt-1 inline-block text-blue-600 hover:text-blue-800 font-medium">
                    support@msmepredictor.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Phone Support */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
              className="card p-6 bg-gradient-to-br from-white to-green-50"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-3 shadow-md">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Phone Support</h3>
                  <p className="mt-2 text-gray-600">
                    Call our support team directly
                  </p>
                  <a href="tel:+18001234567" className="mt-1 inline-block text-green-600 hover:text-green-800 font-medium">
                    +1 (800) 123-4567
                  </a>
                  <p className="mt-1 text-sm text-gray-500">Monday-Friday: 9am-5pm EST</p>
                </div>
              </div>
            </motion.div>

            {/* Live Chat */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' }}
              className="card p-6 bg-gradient-to-br from-white to-purple-50"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-3 shadow-md">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Live Chat</h3>
                  <p className="mt-2 text-gray-600">
                    Chat with our support agents in real-time
                  </p>
                  <button 
                    className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    onClick={() => alert('Live chat would launch here')}
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* FAQ Component */}
        <motion.div
          variants={fadeIn} 
          className="card bg-gradient-to-br from-blue-50 to-indigo-50 mb-10"
        >
          <div className="text-center py-8 px-4">
            <h2 className="text-2xl font-bold gradient-heading mb-4">Still have questions?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Our dedicated team is here to provide you with personalized assistance for any complex issues or inquiries you may have.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              onClick={() => document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Us Now
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// FAQ Component
const FAQ = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-6 py-4 flex justify-between items-center ${isOpen ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'} transition-colors duration-200`}
      >
        <h3 className="text-md font-medium text-gray-900">{faq.question}</h3>
        <svg 
          className={`w-5 h-5 text-blue-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 py-4 bg-white border-t border-gray-200"
        >
          <p className="text-gray-600">{faq.answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HelpSupportPage; 