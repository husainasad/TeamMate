import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ErrorModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full transform transition-all duration-300 scale-95">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-red-600">Error</h2>
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
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                    Close
                </button> */}
            </div>
        </div>
    );
};

export default ErrorModal;