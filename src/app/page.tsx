'use client';
import withoutAuth from '@/hoc/withoutAuth';
import React, { useState, useCallback } from "react";

import { signIn } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation'

// Icon components for better visibility
const PhoneIcon = () => (
  <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  // Preload dashboard route for faster navigation
  React.useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  // Check if error is network-related
  const isNetworkError = (error: any, authResult?: any) => {
    // Check common network error indicators
    const networkErrorPatterns = [
      'network',
      'connection',
      'timeout',
      'fetch',
      'cors',
      'failed to fetch',
      'networkerror',
      'connection refused',
      'connection reset',
      'connection timed out',
      'no internet',
      'offline',
      'dns',
      'unreachable',
      'aborted'
    ];

    // Check error message
    if (error?.message) {
      const errorMessage = error.message.toLowerCase();
      if (networkErrorPatterns.some(pattern => errorMessage.includes(pattern))) {
        return true;
      }
    }

    // Check error name
    if (error?.name) {
      const errorName = error.name.toLowerCase();
      if (errorName.includes('networkerror') || errorName.includes('typeerror')) {
        return true;
      }
    }

    // Check if it's a TypeError with network-related message
    if (error instanceof TypeError) {
      return true;
    }

    // Check for specific HTTP status codes that might indicate network issues
    if (authResult?.status) {
      const networkStatusCodes = [0, 408, 502, 503, 504, 521, 522, 523, 524];
      if (networkStatusCodes.includes(authResult.status)) {
        return true;
      }
    }

    // Check if navigator is offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return true;
    }

    return false;
  };

  // Enhanced error handling function
  const getErrorMessage = (error: any, authResult?: any) => {
    // First priority: Check for network errors
    if (isNetworkError(error, authResult)) {
      return 'Network issue detected. Please check your internet connection and try again.';
    }

    // Second priority: Check API response and status codes
    if (authResult && !authResult.success) {
      // Check HTTP status codes
      if (authResult.status === 401) {
        return 'Invalid credentials. Please check your User ID and password.';
      }
      if (authResult.status === 403) {
        return 'Access denied. Please contact support.';
      }
      if (authResult.status === 429) {
        return 'Too many login attempts. Please try again later.';
      }
      if (authResult.status >= 500) {
        return 'Server error. Please try again later.';
      }

      // Default for failed authentication without specific message
      return 'Invalid credentials. Please check your User ID and password.';
    }

    // Third priority: Generic error handling
    if (error?.message && error.message.length < 100) {
      return error.message;
    }

    // Fallback error message
    return 'Login failed. Please check your credentials and try again.';
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('User ID and Password are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', username.trim());
      formData.append('password', password);

      const authResult = await signIn(formData);

      if (authResult.success) {
        // Update auth context immediately
        login(authResult.data.access_token);

        // Clear form
        setUsername('');
        setPassword('');

        // Direct navigation without waiting
        router.replace('/dashboard');
      } else {
        const errorMessage = getErrorMessage(null, authResult);
        setError(errorMessage);
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      setLoading(false);
    }
  }, [username, password, login, router]);

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-pink-200 to-orange-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-200 to-orange-300 rounded-full opacity-10 blur-2xl"></div>

      <div className="w-full max-w-7xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-white/20">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Mobile Header - Welcome Section (visible only on mobile) */}
          <div className="lg:hidden bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 p-6 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 bg-orange-400 rounded-full opacity-20"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-orange-300 rounded-full opacity-30"></div>
            <div className="absolute top-6 left-1/2 w-8 h-8 bg-white rounded-lg opacity-10 rotate-45"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome Back!
              </h2>
              <p className="text-orange-100 text-sm sm:text-base">
                To Keep Connected With Us Please Login
              </p>
            </div>
          </div>

          {/* Desktop Left Panel - Welcome Section (visible only on desktop) */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute top-20 right-10 w-32 h-32 bg-orange-400 rounded-full opacity-20"></div>
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-orange-300 rounded-full opacity-30"></div>
            <div className="absolute top-40 left-20 w-16 h-16 bg-white rounded-lg opacity-10 rotate-45"></div>
            <div className="absolute top-10 left-1/2 w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-20"></div>

            <div className="relative z-10 flex items-center">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Welcome Back!
                </h2>
                <p className="text-orange-100 text-lg">
                  To Keep Connected With Us Please Login With Your Personal Info
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex-1 lg:w-1/2 p-6 sm:p-8 lg:p-12 bg-white/80 backdrop-blur-sm">
            <div className="max-w-md mx-auto h-full flex flex-col justify-center">
              <div className="text-center mb-6 lg:mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Sign In</h3>
                <p className="text-gray-600 text-sm lg:text-base">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    User ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <PhoneIcon />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors ${error ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Enter your mobile number"
                      required
                      disabled={loading}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <LockIcon />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors ${error ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                  </div>

                  {/* Compact error message - only takes minimal space */}
                  {error && (
                    <p className="text-red-600 text-sm mt-2 flex items-start">
                      <svg className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="leading-tight">{error}</span>
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !username.trim() || !password.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-6 lg:mt-8 text-center">
                <p className="text-gray-600 text-sm lg:text-base">
                  Do not have an account?{' '}
                  <button className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withoutAuth(LoginPage);