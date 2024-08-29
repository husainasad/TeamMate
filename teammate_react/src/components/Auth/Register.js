import React, { useState } from 'react';
import { registerUser } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import { ErrorModal } from '../Tasks/FeedbackModal';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modal, setModal] = useState({ type: null, message: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ username, email, password });
            navigate('/login');
        } catch (error) {
            setModal({ type: 'error', message: 'Registration failed. Please try again.' });
        }
    };

    const closeModal = () => {
        setModal({ type: null, message: '' });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p>Already a user?</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-500 hover:underline"
                    >
                        Login Here
                    </button>
                </div>
            </div>
            {modal.type && modal.type === 'error' && (
                <ErrorModal
                    message={modal.message}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default Register;