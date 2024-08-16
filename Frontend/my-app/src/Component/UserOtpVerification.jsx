import React, { useState } from 'react';

function UserOtpVerification() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyOtp(otp);
      if (response.success) {
        setMessage('OTP Verified Successfully!');
      } else {
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred during verification.');
    }
  };

  const sendOtp = async () => {
    try {
      const response = await requestOtp();
      if (response.success) {
        setMessage('OTP has been sent to your registered email.');
        setIsOtpSent(true);
      } else {
        setMessage('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while sending OTP.');
    }
  };

  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <button onClick={sendOtp} disabled={isOtpSent}>
        Send OTP
      </button>
      {isOtpSent && (
        <form onSubmit={handleOtpSubmit}>
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter OTP"
            maxLength="6"
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

// API function to request OTP
async function requestOtp() {
  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false };
  }
}

// API function to verify OTP
async function verifyOtp(otp) {
  try {
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false };
  }
}

export default UserOtpVerification;
