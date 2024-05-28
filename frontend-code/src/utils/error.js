import Swal from 'sweetalert2';

export const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

/**
 * Function to display error alert using SweetAlert2.
 * If status code is 403, removes token from local storage and redirect to login page.
 * @param {object} errorData - Error data object.
 */
export const showErrorAlert = (errorData) => {
  Swal.fire({
    title: 'Error',
    html: `
        <div style="text-align: left;">
          <p><strong>Title:</strong> ${errorData.title}</p>
          <p><strong>Status:</strong> ${errorData.status}</p>
          <p><strong>Description:</strong> ${errorData.description}</p>
          <p><strong>Detail:</strong> ${errorData.detail}</p>
        </div>
      `,
    icon: 'error',
    confirmButtonText: 'OK',
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      if (errorData.status === 403 || errorData.status === 500) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/') {
          window.location = '/';
        }
      }
    }
  });
};
