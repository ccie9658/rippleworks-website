import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../utils/authApi';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('idle'); // 'idle', 'sending', 'sent', 'error'

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email for the correct link.');
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);
        
        if (response.data.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully! You can now access all features.');
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Verification failed. The link may have expired or is invalid.'
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setResendStatus('sending');
    
    try {
      const response = await authApi.resendVerification(email);
      
      if (response.data.success) {
        setResendStatus('sent');
        setMessage('Verification email sent! Please check your inbox.');
      } else {
        setResendStatus('error');
        setMessage(response.data.message || 'Failed to send verification email');
      }
    } catch (error) {
      setResendStatus('error');
      setMessage(
        error.response?.data?.message || 
        'Failed to send verification email. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Email Verification
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {status === 'verifying' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email Verified!</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                to="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-6">{message}</p>

              {/* Resend verification form */}
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Need a new verification email?</h4>
                <form onSubmit={handleResendVerification} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={resendStatus === 'sending'}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    {resendStatus === 'sending' ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </form>

                {resendStatus === 'sent' && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
                    <p className="text-sm text-green-700">Verification email sent! Please check your inbox.</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Link
                  to="/"
                  className="text-sm text-purple-600 hover:text-purple-500"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;