import axios from 'axios';

const host = 'http://localhost:3003';
const baseUrl = host + '/api/login';

const loginService = {
  login: async credentials => {
    const response = await axios.post(baseUrl, credentials);
    return response.data;
  }
};

export default loginService;
