/**
 * Authentication utilities for managing JWT tokens
 */

export const AUTH_TOKEN_KEY = 'jwt';

/**
 * Get JWT token from localStorage
 */
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.warn('Error accessing localStorage:', error);
    return null;
  }
};

/**
 * Set JWT token in localStorage
 */
export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.warn('Error setting token in localStorage:', error);
  }
};

/**
 * Remove JWT token from localStorage
 */
export const removeAuthToken = (): void => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.warn('Error removing token from localStorage:', error);
  }
};

/**
 * Decode JWT payload (without verification)
 */
export const decodeJWTPayload = (token: string): any => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.warn('Error decoding JWT payload:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWTPayload(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.warn('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get user info from JWT token
 */
export const getUserFromToken = (token?: string): any => {
  const authToken = token || getAuthToken();
  if (!authToken) return null;
  
  if (isTokenExpired(authToken)) {
    removeAuthToken();
    return null;
  }
  
  return decodeJWTPayload(authToken);
};

/**
 * Initialize auth with the provided token
 */
export const initializeAuth = (): void => {
  // Set the JWT token from memory (as provided in the requirements)
  const defaultToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1paWRvQGFkbWluLmNsIiwidXNlcl9pZCI6MSwiY29tcGFueV9pZCI6MTkwLCJpYXQiOjE3NDgwMjA3MTUsImV4cCI6MTc0ODAyNDMxNX0.fpKA240eBxUjb0cE9kU6e6fxHEJdS7EROV3OwIcmkbI';
  
  const existingToken = getAuthToken();
  if (!existingToken) {
    setAuthToken(defaultToken);
    console.log('JWT token initialized in localStorage');
  }
};
