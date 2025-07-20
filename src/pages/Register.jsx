import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm, validationSchemas } from "../hooks/useForm";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Enhanced Register Page Component
 * Features:
 * - Comprehensive form validation
 * - Password strength indicator
 * - Password confirmation matching
 * - Real-time validation feedback
 * - Loading states and error handling
 * - Responsive design
 * - Accessibility features
 */
const Register = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation schema
  const validationSchema = {
    username: {
      required: 'Username is required',
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      validate: (value) => {
        if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
          return 'Username can only contain letters, numbers, and underscores';
        }
        return '';
      }
    },
    email: validationSchemas.email,
    password: {
      required: 'Password is required',
      minLength: 8,
      validate: (value, values) => {
        if (value && value.length < 8) {
          return 'Password must be at least 8 characters long';
        }
        if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        return '';
      }
    },
    confirmPassword: {
      required: 'Please confirm your password',
      validate: (value, values) => {
        if (value !== values.password) {
          return 'Passwords do not match';
        }
        return '';
      }
    },
    agreeToTerms: {
      required: 'You must agree to the terms and conditions'
    }
  };

  // Form submission handler
  const handleSubmit = async (values) => {
    const result = await register({
      username: values.username,
      email: values.email,
      password: values.password
    });
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
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    },
    validationSchema,
    handleSubmit
  );

  // Clear auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  /**
   * Calculate password strength
   */
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthMap = {
      0: { label: 'Very Weak', color: 'bg-red-500' },
      1: { label: 'Weak', color: 'bg-orange-500' },
      2: { label: 'Fair', color: 'bg-yellow-500' },
      3: { label: 'Good', color: 'bg-blue-500' },
      4: { label: 'Strong', color: 'bg-green-500' },
      5: { label: 'Very Strong', color: 'bg-green-600' }
    };

    return { score, ...strengthMap[score] };
  };

  const passwordStrength = getPasswordStrength(values.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Registration Form */}
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
                      Registration Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Username Field */}
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                {...getFieldProps('username')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 ${
                  getFieldProps('username').hasError 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                }`}
                placeholder="Choose a username"
                disabled={isSubmitting}
              />
              {getFieldProps('username').error && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldProps('username').error}
                </p>
              )}
            </div>

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
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  {...getFieldProps('password')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 ${
                    getFieldProps('password').hasError 
                      ? 'border-red-300' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {values.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 w-8 rounded-full ${
                            level <= passwordStrength.score 
                              ? passwordStrength.color 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
              
              {getFieldProps('password').error && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldProps('password').error}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  {...getFieldProps('confirmPassword')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 ${
                    getFieldProps('confirmPassword').hasError 
                      ? 'border-red-300' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showConfirmPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
              {getFieldProps('confirmPassword').error && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldProps('confirmPassword').error}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={values.agreeToTerms}
                    onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-red-600 hover:text-red-500 transition-colors duration-200">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-red-600 hover:text-red-500 transition-colors duration-200">
                      Privacy Policy
                    </a>
                  </label>
                  {getFieldProps('agreeToTerms').error && (
                    <p className="mt-1 text-sm text-red-600">
                      {getFieldProps('agreeToTerms').error}
                    </p>
                  )}
                </div>
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
                    Creating account...
                  </div>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-red-500 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </span>
                    Create Account
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Footer Links */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;