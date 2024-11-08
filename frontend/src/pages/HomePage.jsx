import React, { useState } from 'react';
import { Building2, Truck, Store, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);

  const navigate = useNavigate();

  const links = [
    {
      title: 'Manufacturer',
      icon: <Building2 size={40} />,
      description: 'Manage production, quality control, and distribution of pharmaceutical products',
      color: 'bg-blue-500',
      path: '/manufacture'
    },
    {
      title: 'Wholesaler',
      icon: <Truck size={40} />,
      description: 'Handle bulk distribution, storage, and inventory management',
      color: 'bg-green-500',
      path: '/wholesaler'
    },
    {
      title: 'Pharmacies',
      icon: <Store size={40} />,
      description: 'Track inventory, manage prescriptions, and ensure patient safety',
      color: 'bg-purple-500',
      path: '/pharmacies'
    },
    {
      title: 'Regulators',
      icon: <Scale size={40} />,
      description: 'Monitor compliance, track licenses, and ensure quality standards',
      color: 'bg-red-500',
      path: '/regulators'
    }
  ];

  const handleLinkClick = (path) => {
    setSelectedPath(path);
    setIsModalOpen(true); // Open the modal on link click
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (selectedPath) navigate(selectedPath); // Navigate after login
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 
                className="text-xl font-bold text-gray-800 cursor-pointer"
                onClick={() => navigate('/')}
              >
                PharmChain
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Pharmaceutical Supply Chain Management
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A secure and transparent platform connecting manufacturers, wholesalers, 
              pharmacies, and regulators in the pharmaceutical supply chain.
            </p>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {links.map((link) => (
            <div
              key={link.title}
              className="relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => handleLinkClick(link.path)}
            >
              <div className="p-6">
                <div className={`${link.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                  <div className="text-white">
                    {link.icon}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {link.title}
                </h2>
                <p className="text-gray-600">
                  {link.description}
                </p>
                <div className="mt-4">
                  <span className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center">
                    Enter Dashboard
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Key Features
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="p-6">
                <div className="text-blue-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Secure</h3>
                <p className="mt-2 text-gray-600">End-to-end encryption and blockchain technology</p>
              </div>
              <div className="p-6">
                <div className="text-green-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Traceable</h3>
                <p className="mt-2 text-gray-600">Real-time tracking and monitoring</p>
              </div>
              <div className="p-6">
                <div className="text-purple-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Efficient</h3>
                <p className="mt-2 text-gray-600">Streamlined processes and automation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>© 2024 Pharmaceutical Supply Chain Management. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} />

    </div>
  );
};

export default HomePage;