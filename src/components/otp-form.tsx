"use client";
import API from '@/lib/api';
import React, { useState } from 'react';

export default function OTPForm({ token }: { token: string }) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus to next input
      if (value && index < 5) { // Changed from 3 to 5 for 6-digit OTP
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const otpCode = otp.join('');

    try {
      const response = await API.post(`/api/otp/${token}/`, {
        otp_code: otpCode,
        token: token // Include token in body if your backend expects it there
      });

      if (response.data.detail) {
        setSuccess(response.data.detail);
        // Optionally redirect user or perform other actions on success
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
      console.error("OTP verification error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await API.post(`/users/resend-otp/`, { 
        token: token 
      });
      setSuccess('New OTP sent successfully!');
      setOtp(['', '', '', '', '', '']); // Reset OTP fields
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 ">
      <form className="otp-Form" onSubmit={handleSubmit}>
        <h1 className="mainHeading">Enter OTP</h1>
        <p className="otpSubheading">We have sent a verification code to your email</p>
        
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-500 mb-4 text-center">{success}</div>}

        <div className="inputContainer">
          {otp.map((digit, index) => (
            <input
              key={index}
              required
              maxLength={1}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="otp-input"
              id={`otp-input-${index}`}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              autoFocus={index === 0}
              disabled={isSubmitting}
            />
          ))}
        </div>

        <button 
          type="submit" 
          className="verifyButton"
          disabled={isSubmitting || otp.some(digit => !digit)}
        >
          {isSubmitting ? 'Verifying...' : 'Verify'}
        </button>

        <p className="resendNote">
          Didn't receive the code?{' '}
          <button 
            type="button" 
            className="resendBtn"
            onClick={handleResend}
            disabled={isSubmitting}
          >
            Resend Code
          </button>
        </p>
      </form>
    </div>
  );
}