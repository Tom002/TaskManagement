import React, { Fragment,  useEffect, useContext } from 'react';
import './App.css';
import NavBar from '../features/nav/NavBar';
import TasksGrid from '../features/task/TasksGrid';
import { Route } from 'react-router-dom';
import HomePage from '../features/home/HomePage';
import TaskStore from '../app/stores/taskStore';
import CreateForm from '../features/task/CreateForm';
import EditForm from '../features/task/EditForm';
import TaskPriority from '../features/task/TaskPriority';
import StateCreateForm from '../features/state/StateCreateForm';

const App: React.FC = () => {

  const taskStore = useContext(TaskStore);
  useEffect(() => { 
    taskStore.loadTasks();
    taskStore.loadStates();
  }, [taskStore])

  return (
    <Fragment>
      <NavBar/>
      <Route exact path="/" component={HomePage}/>
      <Route 
        exact
        path="/tasks"
        component ={TasksGrid}
      />
      <Route
        path={"/createTask/"}
        component={CreateForm}
      />
      <Route
        path={"/manageTask/:id"}
        component={EditForm}
      />
      <Route
        path={'/tasks/priority'}
        component={TaskPriority}
      />
      <Route
        path={'/createState'}
        component={StateCreateForm}

      />
    </Fragment>
  );
}

export default App;
