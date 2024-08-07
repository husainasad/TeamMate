import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import { FaHome } from "react-icons/fa";

const Header = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-blue-500 p-4 shadow-md flex justify-between items-center text-white">
            <button 
                onClick={() => navigate('/')} 
                className="flex items-center text-lg font-semibold text-white bg-blue-500 hover:bg-blue-700 p-2 rounded-lg transition"
            >
                <FaHome className="w-5 h-5 mr-2" />
                Home
            </button>
            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        <span className="text-sm font-semibold">Welcome {user?.username}!</span>
                        <button 
                            onClick={handleLogout} 
                            className="text-sm font-semibold bg-red-500 hover:bg-red-600 p-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <span className="text-sm font-light">You are not logged in</span>
                        <button 
                            onClick={() => navigate('/login')} 
                            className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 p-2 rounded transition"
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => navigate('/register')} 
                            className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 p-2 rounded transition"
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;