import {observable, configure, action, runInAction, computed} from 'mobx'
import { ITask } from '../models/ITask';
import agent from '../api/agent';
import { IState } from '../models/IState';
import { SyntheticEvent } from 'react';
import { isUndefined } from 'util';
import { createContext } from 'react';
import { DropdownItemProps } from 'semantic-ui-react';

configure({enforceActions: 'always'})

class TaskStore {
    @observable taskRegistry = new Map<number, ITask>();
    @observable stateRegistry = new Map<number, IState>();
    @observable selectedTask : ITask | null = null;
    @observable loading = false;
    @observable submitting = false;
    @observable target = 0;

    @computed get tasksByOrder() {
        return Array.from(this.taskRegistry.values()).sort(
            (a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0)
        );
    }

    @computed get statesForDropdown(): DropdownItemProps[] {
        return Array.from(this.stateRegistry.values()).map(a => ({
            key : a.id,
            text : a.name,
            value : a.id
        }));
    }

    @computed get newItemOrder() {
        let orders = Array.from(this.taskRegistry.values()).map(a => a.order)
        return Math.max(...orders)+1;
    }

    @action taskPriorityChange = (movedItem: ITask, oldIndex: number, newIndex: number) => {
        // TODO API Update
        this.taskRegistry.set(movedItem.id, {...movedItem, ["order"]: newIndex+1})
        if(oldIndex > newIndex) {
            for (const task of this.taskRegistry.values()) {
                    if((task.order-1) >= newIndex && (task.order-1) < oldIndex && task.id != movedItem.id){
                        // TODO API Update
                        this.taskRegistry.set(task.id, {...task, ["order"]: task.order+1})
                    }
                }
            }
        else if(newIndex > oldIndex) {
            for (const task of this.taskRegistry.values()) {
                if((task.order-1) <= newIndex && (task.order-1) > oldIndex && task.id != movedItem.id){
                    // TODO API Update
                    this.taskRegistry.set(task.id, {...task, ["order"]: task.order-1})
                }
            }
        }
        
    }

    @action loadTasks = async() => {
        this.loading = true;
        try {
            const tasks = await agent.Tasks.list();
            runInAction('loading tasks', () => {
                tasks.forEach(task => {
                    this.taskRegistry.set(task.id, task);
                })
                this.loading = false;
            })
        } catch (error) {
            runInAction('loading tasks error', () => {
                console.log(error);
                this.loading = false;
            })
        }
    }

    @action loadStates = async() => {
        this.loading = true;
        try {
            const states = await agent.States.list();
            runInAction('loading states', () => {
                states.forEach(state => {
                    this.stateRegistry.set(state.id, state);
                })
                this.loading = true;
            })
        } catch (error) {
            runInAction('loading states error', () => {
                console.log(error);
                this.loading = false;
            })
        }
    }

    @action createState = async(state: IState) => {
        this.submitting = true;
        try {
            // TODO
            //let createdId = await agent.States.create(state);
            let createdId = Math.max(...Array.from(this.stateRegistry.values()).map(a => a.id))+1;
            runInAction('creating state',() => {
                state.id = createdId;
                this.stateRegistry.set(createdId, state);
            })
        } catch (error) {
            runInAction('creating task error',() => {
                console.log(error);
                this.submitting = false;
            })
        }
    }

    @action deleteState = async(stateId: number) => {
        this.loading = true;
        try {
            let tasksWithState = Array.from(this.taskRegistry.values()).filter(a => a.stateId === stateId);
            console.log(stateId);
            console.log(tasksWithState);
                for (const task of tasksWithState) {
                    this.taskRegistry.delete(task.id);
                }
                await agent.States.delete(stateId);
                runInAction('deleting status', () => {
                    this.stateRegistry.delete(stateId);
                    this.loading = true;
                })
        } catch (error) {
            runInAction('deleting status error', () => {
                console.log(error);
                this.loading = true;
            })
        }
    }

    @action createTask = async (task: ITask) => {
        this.submitting = true;
        try {
            let createdId = await agent.Tasks.create(task);
            runInAction('creating task',() => {
                task.id = createdId;
                this.taskRegistry.set(createdId, task);
            })
        } catch (error) {
            runInAction('creating task error',() => {
                console.log(error);
                this.submitting = false;
            })
        }
    }

    @action editTask = async (task: ITask) => {
        this.submitting = true;
        try {
            await agent.Tasks.update(task);
            runInAction('edit task',() =>{
                this.taskRegistry.set(task.id, task);
                this.selectedTask = task;
            })
        } catch (error) {
            runInAction('edit task error',() => {
                console.log(error);
                this.submitting = false;
            })
        }
    }

    @action deleteTask = async (event: SyntheticEvent<HTMLButtonElement>, id: number) => {
        let taskToDelete = this.taskRegistry.get(id);
        if(!isUndefined(taskToDelete)) {
            this.submitting = true;
            this.target = Number(event.currentTarget.name);
            try {
                await agent.Tasks.delete(id);
                runInAction('delete task',() => {
                    this.taskRegistry.delete(id);
                    let keys :number[] = Array.from(this.taskRegistry.keys());
                    for (let key of keys) {
                        let element = this.taskRegistry.get(key);
                        if(element && element.order > taskToDelete!.order)
                        {
                            element.order--;
                            this.taskRegistry.set(key, element);
                        }
                    }
                    this.submitting = false;
                    this.target = 0;
                })
            } catch (error) {
                runInAction(() => {
                    console.log(error);
                    this.submitting = false;
                    this.target = 0;
                })
            }
        }
    }

    @action loadTask = async (id: number) => {
        let task = this.taskRegistry.get(id);
        if(task) {
            this.selectedTask = task;
        }
        else {
            this.loading = true;
            try {
                task = await agent.Tasks.details(id);
                runInAction('getting single task',() => {
                    this.selectedTask = isUndefined(task) ? null : task;
                    this.loading = false;
                })
            } catch (error) {
                runInAction('error getting single task',() => {
                    this.loading = false; 
                })
            }
        }
    }

    @action clearTask = () => {
        this.selectedTask = null;
    }


}

export default createContext(new TaskStore())