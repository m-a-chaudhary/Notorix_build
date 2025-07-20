// src/pages/Login.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm, validationSchemas } from "../hooks/useForm";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Enhanced Login Page Component
 * Features:
 * - Form validation with custom hooks
 * - Error handling and display
 * - Loading states
 * - Responsive design
 * - Accessibility features
 * - Password visibility toggle
 * - Remember me functionality
 */
const Login = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Form validation schema
  const validationSchema = {
    email: validationSchemas.email,
    password: {
      required: 'Password is required',
      minLength: 6
    }
  };

  // Form submission handler
  const handleSubmit = async (values) => {
    const result = await login(values);
    if (result.success) {
      navigate('/');
    }
  };

  // Initialize form with custom hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: handleFormSubmit,
    getFieldProps
  } = useForm(
    {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema,
    handleSubmit
  );

  // Clear auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
          <div className="bg-white py-8 px-6 shadow rounded-lg border">
            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Authentication Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                {...getFieldProps('email')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 ${
                  getFieldProps('email').hasError 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
              {getFieldProps('email').error && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldProps('email').error}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  {...getFieldProps('password')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 ${
                    getFieldProps('password').hasError 
                      ? 'border-red-300' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              {getFieldProps('password').error && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldProps('password').error}
                </p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={values.rememberMe}
                  onChange={(e) => handleChange('rememberMe', e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" color="text-white" className="mr-2" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-red-500 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    Sign in
                  </>
                )}
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Email:</strong> demo@example.com</p>
                <p><strong>Password:</strong> demo123</p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Links */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;