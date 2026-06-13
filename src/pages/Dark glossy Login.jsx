import React from 'react';

const DarkGlossyLogin = () => {
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: '#121212', 
            color: '#ffffff' 
        }}>
            <form style={{ 
                background: 'linear-gradient(145deg, #1a1a1a, #0d0d0d)', 
                borderRadius: '10px', 
                padding: '40px', 
                boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #1b1b1b' 
            }}>
                <h2 style={{ textAlign: 'center' }}>Login</h2>
                <div style={{ marginBottom: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            border: 'none', 
                            borderRadius: '5px', 
                            background: '#2a2a2a', 
                            color: '#ffffff' 
                        }} 
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            border: 'none', 
                            borderRadius: '5px', 
                            background: '#2a2a2a', 
                            color: '#ffffff' 
                        }} 
                    />
                </div>
                <button 
                    type="submit" 
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        border: 'none', 
                        borderRadius: '5px', 
                        background: '#007BFF', 
                        color: '#ffffff', 
                        cursor: 'pointer' 
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default DarkGlossyLogin;