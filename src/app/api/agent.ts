import axios, { AxiosResponse } from 'axios';
import { ITask } from '../models/ITask';
import { IState } from '../models/IState';

axios.defaults.baseURL = 'https://my-json-server.typicode.com/Tom002/Temalab';

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody)
}

const Tasks = {
    list: (): Promise<ITask[]> => requests.get('/tasks'),
    details: (id: number) => requests.get(`/tasks/${id}`),
    create: (task: ITask) => requests.post('/tasks', task),
    update: (task: ITask) => requests.put(`/tasks/${task.id}`, task),
    delete: (id: number) => requests.del(`/tasks/${id}`)
}

const States = {
    list: (): Promise<IState[]> => requests.get('/states'),
    details: (id: number) => requests.get(`/states/${id}`),
    create: (task: IState): Promise<number> => requests.post('/states', task),
    delete: (id: number) => requests.del(`/states/${id}`)
}

export default {
    Tasks,
    States
}



