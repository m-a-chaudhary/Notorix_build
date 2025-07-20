import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for form handling with validation and error management
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationSchema - Validation rules for each field
 * @param {Function} onSubmit - Function to call when form is submitted
 * @returns {Object} - Form state and handlers
 */
export const useForm = (initialValues = {}, validationSchema = {}, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback((name, value) => {
    const rules = validationSchema[name];
    if (!rules) return '';

    // Required validation
    if (rules.required && (!value || value.trim() === '')) {
      return rules.required === true ? `${name} is required` : rules.required;
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      return rules.minLength === true 
        ? `${name} must be at least ${rules.minLength} characters` 
        : rules.minLength;
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return rules.maxLength === true 
        ? `${name} must be no more than ${rules.maxLength} characters` 
        : rules.maxLength;
    }

    // Pattern validation (regex)
    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.pattern === true 
        ? `${name} format is invalid` 
        : rules.pattern;
    }

    // Custom validation function
    if (rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(value, values);
      if (customError) return customError;
    }

    return '';
  }, [validationSchema, values]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(validationSchema).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField, validationSchema, values]);

  // Handle input change
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle input blur (for touched state)
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField, values]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationSchema).forEach(fieldName => {
      allTouched[fieldName] = true;
    });
    setTouched(allTouched);

    // Validate form
    const isValid = validateForm();
    
    if (!isValid) {
      return false;
    }

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }

    return true;
  }, [validateForm, onSubmit, values, isSubmitting, validationSchema]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set form values (useful for editing)
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
  }, []);

  // Get field props for easy use in inputs
  const getFieldProps = useCallback((name) => ({
    value: values[name] || '',
    onChange: (e) => handleChange(name, e.target.value),
    onBlur: () => handleBlur(name),
    error: touched[name] && errors[name],
    hasError: touched[name] && errors[name]
  }), [values, handleChange, handleBlur, touched, errors]);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  // Check if form is dirty (has changes)
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues,
    getFieldProps,
    validateField,
    validateForm
  };
};

/**
 * Validation schemas for common use cases
 */
export const validationSchemas = {
  // Email validation
  email: {
    required: 'Email is required',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validate: (value) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
      return '';
    }
  },

  // Password validation
  password: {
    required: 'Password is required',
    minLength: 8,
    validate: (value) => {
      if (value && value.length < 8) {
        return 'Password must be at least 8 characters long';
      }
      if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
      return '';
    }
  },

  // Username validation
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

  // Required field validation
  required: {
    required: true
  }
}; 