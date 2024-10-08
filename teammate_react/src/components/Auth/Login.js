import React, { useState, useContext } from 'react';
import { loginUser } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import { ErrorModal } from '../Tasks/FeedbackModal';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modal, setModal] = useState({ type: null, message: '' });
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ username, password });
            login(response.data.access, response.data.refresh, username);
            navigate('/');
        } catch (error) {
            setModal({ type: 'error', message: 'Login failed. Please check your credentials and try again.' });
        }
    };

    const closeModal = () => {
        setModal({ type: null, message: '' });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p>Not Registered?</p>
                    <button
                        onClick={() => navigate('/register')}
                        className="text-blue-500 hover:underline"
                    >
                        Register Here
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

export default Login;