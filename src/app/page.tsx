'use client';
import withoutAuth from '@/hoc/withoutAuth';
import React, { useState, useCallback } from "react";

import { signIn } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation'

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
      formData.append('username', username);
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
        setError(authResult?.message || 'Invalid credentials.');
        setLoading(false);
      }
    } catch (error: any) {
      setError(error?.message || 'Login failed. Please try again.');
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
        <div className="flex flex-col lg:flex-row">
          {/* Left Panel - Welcome Section */}
          <div className="lg:w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute top-20 right-10 w-32 h-32 bg-orange-400 rounded-full opacity-20"></div>
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-orange-300 rounded-full opacity-30"></div>
            <div className="absolute top-40 left-20 w-16 h-16 bg-white rounded-lg opacity-10 rotate-45"></div>
            <div className="absolute top-10 left-1/2 w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-20"></div>
            
            <div className="relative z-10">
              <div className="mb-8"></div>
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
          <div className="lg:w-1/2 p-8 lg:p-12 bg-white/80 backdrop-blur-sm">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h3>
                <p className="text-gray-600">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    User ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !username.trim() || !password.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
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
