import React, { useState } from 'react';

const Otp = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Logic to send OTP
      setStep(2);
    } else {
      // Logic to verify OTP
      alert('OTP Verified');
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg)',
      padding: '20px',
      borderRadius: '8px',
      width: '300px',
      margin: '50px auto',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <div>
            <label style={{ color: 'var(--text)' }}>Phone Number:</label>
            <div>
              <select style={{ borderColor: 'var(--border)', marginRight: '5px', padding: '10px' }}>
                <option value="+98">+98</option>
                {/* Add more country codes as needed */}
              </select>
              <input 
                type="tel" 
                placeholder="Phone number" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                style={{ 
                  borderColor: 'var(--border)', 
                  padding: '10px', 
                  width: 'calc(100% - 55px)',
                  marginBottom: '10px'
                }}
                required 
              />
            </div>
            <button type="submit" style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', width: '100%' }}>Send code</button>
          </div>
        ) : (
          <div>
            <label style={{ color: 'var(--text)' }}>Enter OTP:</label>
            <input 
              type="text" 
              placeholder="OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              style={{ 
                borderColor: 'var(--border)', 
                padding: '10px', 
                width: '100%',
                marginBottom: '10px' 
              }} 
              required 
            />
            <button type="submit" style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', width: '100%' }}>Verify</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Otp;