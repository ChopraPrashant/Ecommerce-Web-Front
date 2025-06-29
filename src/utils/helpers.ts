/**
 * Formats a number as a currency string
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a date string into a human-readable format
 * @param date - The date string or Date object to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

/**
 * Truncates a string to a specified length and adds an ellipsis if needed
 * @param str - The string to truncate
 * @param maxLength - The maximum length of the string
 * @returns The truncated string
 */
export const truncate = (str: string, maxLength: number): string => {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Generates a unique ID
 * @param prefix - Optional prefix for the ID
 * @returns A unique ID string
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounces a function
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced function
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

/**
 * Throttles a function
 * @param func - The function to throttle
 * @param limit - The time limit in milliseconds
 * @returns A throttled function
 */
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let inThrottle = false;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Creates a deep clone of an object
 * @param obj - The object to clone
 * @returns A deep clone of the object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as unknown as T;
  }
  
  const clone: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  
  return clone as T;
};

/**
 * Converts an object to a query string
 * @param params - The object to convert
 * @returns A query string
 */
export const toQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  const appendParam = (key: string, value: any) => {
    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(`${key}[]`, String(item)));
    } else if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  };
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Handle nested objects
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        appendParam(`${key}[${nestedKey}]`, nestedValue);
      });
    } else {
      appendParam(key, value);
    }
  });
  
  return searchParams.toString();
};

/**
 * Parses a query string into an object
 * @param queryString - The query string to parse
 * @returns An object with the parsed query parameters
 */
export const parseQueryString = (queryString: string): Record<string, any> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, any> = {};
  
  for (const [key, value] of params.entries()) {
    // Handle array notation (e.g., categories[]=1&categories[]=2)
    const arrayMatch = key.match(/^(\w+)\[\]$/);
    if (arrayMatch) {
      const arrayKey = arrayMatch[1];
      if (!result[arrayKey]) {
        result[arrayKey] = [];
      }
      result[arrayKey].push(value);
    } 
    // Handle object notation (e.g., filter[price][min]=10)
    else if (key.includes('[') && key.endsWith(']')) {
      const [parentKey, ...nestedKeys] = key.split(/\[|\]/).filter(Boolean);
      let current = result;
      
      for (let i = 0; i < nestedKeys.length; i++) {
        const currentKey = nestedKeys[i];
        const isLast = i === nestedKeys.length - 1;
        
        if (isLast) {
          current[currentKey] = value;
        } else {
          if (!current[currentKey]) {
            current[currentKey] = {};
          }
          current = current[currentKey];
        }
      }
    } 
    // Handle regular key-value pairs
    else {
      result[key] = value;
    }
  }
  
  // Convert string 'true'/'false' to boolean
  Object.keys(result).forEach(key => {
    if (result[key] === 'true') result[key] = true;
    if (result[key] === 'false') result[key] = false;
    
    // Convert string numbers to numbers
    if (!isNaN(Number(result[key]))) {
      result[key] = Number(result[key]);
    }
  });
  
  return result;
};

/**
 * Formats a number with commas as thousand separators
 * @param num - The number to format
 * @returns The formatted number as a string
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generates a random string of a specified length
 * @param length - The length of the random string
 * @returns A random string
 */
export const randomString = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Checks if a value is empty
 * @param value - The value to check
 * @returns True if the value is empty, false otherwise
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * Safely gets a nested property from an object
 * @param obj - The object to get the property from
 * @param path - The path to the property (e.g., 'user.profile.name')
 * @param defaultValue - The default value to return if the property doesn't exist
 * @returns The value of the property or the default value
 */
export const get = (
  obj: any,
  path: string,
  defaultValue: any = undefined
): any => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  
  const result = travel(/[,[\]]+?/) || travel(/[.]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

/**
 * Groups an array of objects by a key
 * @param array - The array to group
 * @param key - The key to group by
 * @returns An object with keys as the grouped values and values as arrays of items
 */
export const groupBy = <T>(
  array: T[],
  key: string
): Record<string, T[]> => {
  return array.reduce((result, currentValue) => {
    const groupKey = String(get(currentValue, key));
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentValue);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Removes duplicate objects from an array based on a key
 * @param array - The array to remove duplicates from
 * @param key - The key to check for duplicates
 * @returns A new array with duplicates removed
 */
export const uniqueBy = <T>(array: T[], key: string): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = get(item, key);
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Sorts an array of objects by a key
 * @param array - The array to sort
 * @param key - The key to sort by
 * @param order - The sort order ('asc' or 'desc')
 * @returns A new sorted array
 */
export const sortBy = <T>(
  array: T[],
  key: string,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const valueA = get(a, key);
    const valueB = get(b, key);
    
    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Formats a number as a file size string
 * @param bytes - The size in bytes
 * @param decimals - The number of decimal places
 * @returns The formatted file size string
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
