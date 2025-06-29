import React, { useState, useCallback, useRef } from 'react';
import { AxiosRequestConfig } from 'axios';
import http from '../utils/api';

type ApiFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

export const useApi = <T, Args extends any[] = any[]>(
  apiCall: ApiFunction<T, Args>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    onFinally?: () => void;
  } = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const request = useRef<Promise<T> | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      const currentRequest = apiCall(...args);
      request.current = currentRequest;
      
      setIsLoading(true);
      setStatus('loading');
      setError(null);
      
      try {
        const result = await currentRequest;
        
        // Only process if this is still the most recent request
        if (request.current === currentRequest) {
          setData(result);
          setStatus('success');
          if (options.onSuccess) {
            options.onSuccess(result);
          }
          return result;
        }
      } catch (err) {
        // Only process if this is still the most recent request
        if (request.current === currentRequest) {
          setError(err);
          setStatus('error');
          if (options.onError) {
            options.onError(err);
          }
          throw err;
        }
      } finally {
        if (request.current === currentRequest) {
          setIsLoading(false);
          if (options.onFinally) {
            options.onFinally();
          }
        }
      }
    },
    [apiCall, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus('idle');
    setIsLoading(false);
    request.current = null;
  }, []);

  return {
    data,
    error,
    isLoading,
    status,
    execute,
    reset,
  };
};

export const useGet = <T>(
  url: string,
  config?: AxiosRequestConfig,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    onFinally?: () => void;
    immediate?: boolean;
  }
) => {
  const { immediate = false, ...apiOptions } = options || {};
  
  const getData = useCallback(
    (params?: any) => http.get<T>(url, { ...config, params }),
    [url, config]
  );
  
  const { execute, ...rest } = useApi(getData, apiOptions);
  
  // Execute immediately if requested
  const executeImmediate = useCallback(
    (params?: any) => execute(params),
    [execute]
  );
  
  // Auto-execute on mount if immediate is true
  React.useEffect(() => {
    if (immediate) {
      executeImmediate();
    }
  }, [executeImmediate, immediate]);
  
  return { ...rest, execute: executeImmediate };
};

export const usePost = <T, D = any>(
  url: string,
  config?: AxiosRequestConfig,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    onFinally?: () => void;
  }
) => {
  const postData = useCallback(
    (data: D) => http.post<T>(url, data, config),
    [url, config]
  );
  
  return useApi(postData, options);
};

export const usePut = <T, D = any>(
  url: string,
  config?: AxiosRequestConfig,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    onFinally?: () => void;
  }
) => {
  const putData = useCallback(
    (data: D) => http.put<T>(url, data, config),
    [url, config]
  );
  
  return useApi(putData, options);
};

export const usePatch = <T, D = any>(
  url: string,
  config?: AxiosRequestConfig,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    onFinally?: () => void;
  }
) => {
  const patchData = useCallback(
    (data: D) => http.patch<T>(url, data, config),
    [url, config]
  );
  
  return useApi(patchData, options);
};

export const useDelete = <T>(
  url: string,
  config?: AxiosRequestConfig,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    onFinally?: () => void;
  }
) => {
  const deleteData = useCallback(
    (params?: any) => http.delete<T>(url, { ...config, params }),
    [url, config]
  );
  
  return useApi(deleteData, options);
};
