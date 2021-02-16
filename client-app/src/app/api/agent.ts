import axios, { AxiosResponse } from 'axios'
import { Activity } from '../models/activity';

//a delay component that takes in a number
const sleep = (delay: number) => {
  return new Promise((resolve) =>{
    setTimeout(resolve, delay)
  })
}

//default url of talking to the api
axios.defaults.baseURL = 'http://localhost:5051/api';

//intercept the signal so that the frontend has to wait for the api to response
axios.interceptors.response.use(async response => {
  try {
    await sleep(1000);
    return response;
  } catch(error) {
    console.log(error);
    return await Promise.reject(error);
  }
})

//arrow function to take in the response from the api
const responseBody = <T> (response: AxiosResponse<T>) => response.data;

//all axios requests in one variable
const requests = {
  get: <T> (url: string) => axios.get<T>(url).then(responseBody),
  post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

//object that stores our requests for Activities
const Activities = {
  list: () => requests.get<Activity[]>('/activities'),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => requests.post<void>('/activities', activity),
  update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const agent = {
  Activities
}

export default agent;