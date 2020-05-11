import { HostService } from './host.service.js';

export const voteService = {
  AddVote,
};

function AddVote(articleId, rating) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', jwt: getToken() },
    body: JSON.stringify({ articleId, rating }),
  };

  return fetch(HostService.GetHost() + `/vote/vote/`, requestOptions).then(handleResponse);
}

function getToken() {
  let jwt = JSON.parse(localStorage.getItem('jwt'));
  return jwt;
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
