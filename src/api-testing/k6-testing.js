import http from 'k6/http';

export const options = {
  vus: 50,
  duration: '50s',
};

export default function () {
  const url = 'http://localhost:8080/users/';
  const payload = JSON.stringify({
    username: `user${__VU}-${Date.now()}`,
    password: 'testpass',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.get(url, payload, params);
}
