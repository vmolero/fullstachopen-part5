import { useState } from 'react';
import axios from 'axios';

export const useField = type => {
  const [value, setValue] = useState('');

  const onChange = event => {
    setValue(event.target.value);
  };

  const onReset = () => setValue('');

  return {
    type,
    value,
    onChange,
    onReset
  };
};

export const useResource = baseUrl => {
  const [resources, setResources] = useState([]);

  const getAll = async token => {
    const response = await axios.get(baseUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setResources(response.data);
  };

  const create = async (payload, token) => {
    await axios.post(baseUrl, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await getAll(token);
  };

  const update = async (blog, token) => {
    await axios.put(baseUrl + '/' + blog.id, blog, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await getAll(token);
  };

  const deleteResource = async (blog, token) => {
    await axios.delete(baseUrl + '/' + blog.id, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await getAll(token);
  };

  const service = {
    getAll,
    create,
    delete: deleteResource,
    update
  };

  return [resources, service];
};
