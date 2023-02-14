export const confirmLogin = () => {
  const userObj = JSON.parse(localStorage.getItem('user'));
  const token = JSON.parse(localStorage.getItem('token'));
  if (userObj && token) {
  return true
  }

  return false
};
