import React from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const SuccessModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full transform transition-all duration-300 scale-95">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <h2 className="text-xl font-semibold text-green-600">Success</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 transition"
                    >
                        <FaTimes />
                    </button>
                </div>
                <p className="text-gray-700 mb-6">{message}</p>
                {/* <button
                    onClick={onClose}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                    Close
                </button> */}
            </div>
        </div>
    );
};

export default SuccessModal;