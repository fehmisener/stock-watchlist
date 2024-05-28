import { handleResponse, showErrorAlert } from '../utils/error';

export const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8080/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:5173',
      },
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Login failed', error);
    showErrorAlert(error);
  }
};

export const validateToken = async (token) => {
  try {
    const response = await fetch(
      'http://localhost:8080/v1/auth/validateToken',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:5173',
        },
        body: token,
      }
    );
    return await handleResponse(response);
  } catch (error) {
    console.error('Login failed', error);
    showErrorAlert(error);
  }
};
