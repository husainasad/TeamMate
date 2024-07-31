import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

const Header = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav>
            <button onClick={() => navigate('/')}>Home</button>
            {isAuthenticated ? (
                <>  
                    <div>Welcome {user?.username}</div>
                    <button onClick={() => navigate('/add-task')}>Add Task</button>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>  
                    <div>You are not logged in</div>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/register')}>Register</button>
                </>
            )}
        </nav>
    );
};

export default Header;