import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for making API calls with loading states, error handling, and caching
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {boolean} immediate - Whether to execute the request immediately
 * @param {number} cacheTime - Cache duration in milliseconds
 * @returns {Object} - { data, loading, error, execute, refetch }
 */
export const useApi = (url, options = {}, immediate = true, cacheTime = 5 * 60 * 1000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use refs to store cache and abort controller
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  // Memoized execute function to prevent unnecessary re-renders
  const execute = useCallback(async (customUrl = url, customOptions = options) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    // Check cache first
    const cacheKey = `${customUrl}-${JSON.stringify(customOptions)}`;
    const cachedData = cacheRef.current.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < cacheTime) {
      setData(cachedData.data);
      setError(null);
      return { success: true, data: cachedData.data };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(customUrl, {
        ...customOptions,
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          ...customOptions.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache the result
      cacheRef.current.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      setData(result);
      setLoading(false);
      
      return { success: true, data: result };
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was cancelled, don't update state
        return { success: false, error: 'Request cancelled' };
      }
      
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, [url, options, cacheTime]);

  // Refetch function to clear cache and re-execute
  const refetch = useCallback(async () => {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    cacheRef.current.delete(cacheKey);
    return await execute();
  }, [execute, url, options]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }

    // Cleanup function to abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    refetch
  };
};

/**
 * Custom hook for making POST requests
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Additional fetch options
 * @returns {Object} - { data, loading, error, execute }
 */
export const usePost = (url, options = {}) => {
  return useApi(url, { ...options, method: 'POST' }, false);
};

/**
 * Custom hook for making PUT requests
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Additional fetch options
 * @returns {Object} - { data, loading, error, execute }
 */
export const usePut = (url, options = {}) => {
  return useApi(url, { ...options, method: 'PUT' }, false);
};

/**
 * Custom hook for making DELETE requests
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Additional fetch options
 * @returns {Object} - { data, loading, error, execute }
 */
export const useDelete = (url, options = {}) => {
  return useApi(url, { ...options, method: 'DELETE' }, false);
}; 