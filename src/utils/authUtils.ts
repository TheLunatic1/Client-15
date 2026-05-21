/**
 * JWT Authentication utilities for frontend validation
 */

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    // Basic JWT validation - check if it has 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Decode payload (middle part)
    const payload = JSON.parse(atob(parts[1]));

    // Check if token is expired
    if (payload.exp) {
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expirationTime;
    }

    return true;
  } catch (error) {
    console.warn('Invalid JWT token format:', error);
    return false;
  }
};

export const getTokenPayload = (): Record<string, any> | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    return JSON.parse(atob(parts[1]));
  } catch (error) {
    console.warn('Failed to decode token payload:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isLoggedIn') === 'true' && isTokenValid();
};

export const logout = (): void => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userProfileImage');
  localStorage.removeItem('isAdminAuthorized');
};
