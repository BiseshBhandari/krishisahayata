import axios from 'axios';

const apiUrl = axios.create({
    baseURL: 'http://localhost:3000/'
});

const sendDynamicRequest = async (method, url, Data) => {

    const isFile = Data instanceof FormData;

    const response = await apiUrl({
        method: method,
        url: url,
        data: method === 'get' ? null : Data,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': isFile ? 'multipart/form-data' : 'application/json'
        }
    });

    return response.data;
};

export default sendDynamicRequest;
