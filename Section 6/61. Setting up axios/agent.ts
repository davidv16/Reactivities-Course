import axios, { AxiosResponse } from 'axios'

//default url of talking to the api
axios.defaults.baseURL = 'http://localhost:5051/api';

//arrow function to take in the response from the api
const responseBody = (response: AxiosResponse) => response.data;

//all axios requests in one variable
const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
}

//object that stores our requests
const Activities = {
  list: () => requests.get('/activities')
}

const agent = {
  Activities
}

export default agent;