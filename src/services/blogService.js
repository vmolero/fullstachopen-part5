import axios from 'axios';

const baseUrl = '/api/blogs';
const blogService = {
  getAll: async token => {
    const response = await axios.get(baseUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  create: (blog, token) => {
    return axios.post(baseUrl, blog, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  update: async (blog, token) => {
    const response = await axios.put(baseUrl + '/' + blog.id, blog, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  delete: (blog, token) => {
    return axios.delete(baseUrl + '/' + blog.id, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default blogService;
