import React from 'react';

const Login = () => {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#121212',
            color: '#fff',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: '#1f1f1f',
                borderRadius: '10px',
                padding: '40px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                <h2 style={{
                    marginBottom: '20px',
                    fontWeight: 'bold'
                }}>Login</h2>
                <input type="text" placeholder="Username" style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '20px',
                    borderRadius: '5px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: '#2a2a2a',
                    color: '#fff'
                }} />
                <input type="password" placeholder="Password" style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '20px',
                    borderRadius: '5px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: '#2a2a2a',
                    color: '#fff'
                }} />
                <button style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#3f51b5',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>Login</button>
            </div>
        </div>
    );
};

export default Login;