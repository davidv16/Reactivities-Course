import axios, { AxiosResponse } from 'axios'
import { Activity } from '../models/activity';

//default url of talking to the api
axios.defaults.baseURL = 'http://localhost:5051/api';

//arrow function to take in the response from the api
const responseBody = <T> (response: AxiosResponse<T>) => response.data;

//all axios requests in one variable
const requests = {
  get: <T> (url: string) => axios.get<T>(url).then(responseBody),
  post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

//object that stores our requests
const Activities = {
  list: () => requests.get<Activity[]>('/activities')
}

const agent = {
  Activities
}

export default agent;