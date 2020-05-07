export const userService = {
  login,
  register,
  getJWT,
  logout,
};

function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  };

  return fetch(`http://danielmigchelsgateway.kn01.fhict.nl/user/user/login`, requestOptions).then(handleResponse);
}

function register(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  };

  return fetch(`http://danielmigchelsgateway.kn01.fhict.nl/user/user/register`, requestOptions).then(handleResponse);
}

function logout() {
  localStorage.removeItem('jwt');
}

function getJWT() {
  return localStorage.getItem('jwt');
}

function handleResponse(response) {
  return response.text().then(text => {
    if (!response.ok) {
      return Promise.reject(text);
    }

    const data = text && JSON.parse(text);

    return data;
  });
}
