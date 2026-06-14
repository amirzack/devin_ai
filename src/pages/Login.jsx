import React, { useState } from 'react';

const Login = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    // Simulate sending code
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Simulate verification process
    alert('Phone verified!');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)', padding: '2rem', maxWidth: '400px', margin: '2rem auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      {step === 1 && (
        <form onSubmit={handlePhoneSubmit}>
          <label style={{ color: 'var(--text)' }} htmlFor="phone">Phone number:</label>
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <select style={{ marginRight: '0.5rem' }} defaultValue="+98">
              <option value="+98">+98</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '4px' }}
              required
            />
          </div>
          <button type="submit" style={{ backgroundColor: 'var(--accent)', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Send code</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleOtpSubmit}>
          <label style={{ color: 'var(--text)' }} htmlFor="otp">Enter OTP:</label>
          <input 
            type="text" 
            id="otp" 
            name="otp" 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: '4px' }}
            required
          />
          <button type="submit" style={{ backgroundColor: 'var(--accent)', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Verify</button>
        </form>
      )}
    </div>
  );
};

export default Login;