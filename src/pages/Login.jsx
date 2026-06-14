import React from 'react';

const Login = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: 'black', 
      color: 'white'
    }}>
      <div style={{ 
        padding: '20px', 
        borderRadius: '5px', 
        backgroundColor: '#333', 
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
      }}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <form style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px' }}>
            Username:
            <input type="text" name="username" style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '3px', border: '1px solid #555', backgroundColor: '#222', color: 'white' }} />
          </label>
          <label style={{ marginBottom: '15px' }}>
            Password:
            <input type="password" name="password" style={{ width: '100%', padding: '8px', borderRadius: '3px', border: '1px solid #555', backgroundColor: '#222', color: 'white' }} />
          </label>
          <button type="submit" style={{ padding: '10px', borderRadius: '3px', border: 'none', backgroundColor: '#444', color: 'white', cursor: 'pointer' }}>
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
