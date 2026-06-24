function Logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  location.href = '/account/register';
}

export default Logout;
