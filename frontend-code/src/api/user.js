import Swal from 'sweetalert2';
import { handleResponse, showErrorAlert } from '../utils/error';

const getToken = () => localStorage.getItem('token');

export const saveWatchlist = async (watchlist) => {
  const token = getToken();

  try {
    const response = await fetch('http://localhost:8080/v1/watchlist/add', {
      method: 'POST',
      body: JSON.stringify(watchlist),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    await handleResponse(response);
    Swal.fire({
      title: 'Success',
      text: 'Watchlist saved to database!',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  } catch (error) {
    console.error('Error saving watchlist:', error);
    showErrorAlert(error);
  }
};

export const getWatchlist = async () => {
  const token = getToken();

  try {
    const response = await fetch('http://localhost:8080/v1/watchlist/get', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    showErrorAlert(error);
  }
};

export const deleteItemFromWatchlist = async (symbol) => {
  const token = getToken();

  try {
    const response = await fetch(
      `http://localhost:8080/v1/watchlist/deleteItem?symbol=${symbol}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      title: 'Success',
      text: 'Item removed from watchlist',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  } catch (error) {
    console.error('Error removing stock from watchlist:', error);
    showErrorAlert(error);
  }
};
