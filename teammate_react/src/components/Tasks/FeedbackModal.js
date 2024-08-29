import React from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

const Modal = ({ type, message, onClose }) => {
    const isError = type === 'error';
    const title = isError ? 'Error' : 'Success';
    const icon = isError ? <FaTimes className="text-red-500" /> : <FaCheckCircle className="text-green-500" />;
    const titleColor = isError ? 'text-red-600' : 'text-green-600';

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full transform transition-all duration-300 scale-95">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        {icon}
                        <h2 className={`text-xl font-semibold ${titleColor} ml-2`}>{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 transition"
                    >
                        <FaTimes />
                    </button>
                </div>
                <p className="text-gray-700 mb-6">{message}</p>
            </div>
        </div>
    );
};

export const ErrorModal = (props) => <Modal {...props} type="error" />;
export const SuccessModal = (props) => <Modal {...props} type="success" />;