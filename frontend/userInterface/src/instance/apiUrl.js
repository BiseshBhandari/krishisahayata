import axios from 'axios';

const apiUrl = axios.create({
    baseURL: 'http://localhost:3000/',
});

const sendDynamicRequest = async (method, url, data) => {
    const isFile = data instanceof FormData;

    try {
        const response = await apiUrl({
            method: method,
            url: url,
            data: method === 'get' ? null : data,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': isFile ? 'multipart/form-data' : 'application/json' 
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error in API request:", error);
        throw error;
    }
};

export default sendDynamicRequest;
    