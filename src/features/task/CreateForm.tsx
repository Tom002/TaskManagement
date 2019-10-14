import React, { useContext, useState, FormEvent } from 'react'
import TaksStore from '../../app/stores/taskStore';
import { ITask } from '../../app/models/ITask';
import { RouteComponentProps } from 'react-router';
import { Segment, Form, Button, Dropdown, DropdownProps, Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

const CreateForm: React.FC<RouteComponentProps> = ({history}) => {

    const taskStore = useContext(TaksStore);
    const {createTask, statesForDropdown, newItemOrder} = taskStore;

    const [task, setTask] = useState<ITask>({
        id: 0,
        title: '',
        description: '',
        deadline: '',
        stateId: 0,
        order: 0
      });
    
    const handleSubmit = () => {
        task.order = newItemOrder;
        createTask(task).then(() => history.push('/tasks'));
    }

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setTask({...task, [name]: value});
      }

    const handleDropdownChange = (event: any, data: DropdownProps ) => {
      console.log(task.stateId);
      if(data.value) {
        setTask({...task, ['stateId'] : Number(data.value)});
      }
    }

    return (

      <Grid>
        <Grid.Column width={10}>
          <Segment clearing style={{marginTop: '3.5em'}}>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} name='title' placeholder='Title' value={task.title}/>
                <Form.TextArea onChange={handleInputChange} name='description' placeholder='Description' value={task.description}/>
                <Form.Input onChange={handleInputChange} name='deadline' placeholder='Deadline' type='date' value={task.deadline}/>
                <Dropdown placeholder="State" selection options={statesForDropdown} value={task.stateId} onChange={handleDropdownChange}/>
                <Button floated='right' positive type='submit' content='Submit'/>
                <Button onClick={() => {history.push('/tasks')}} floated='right' type='button' content='Cancel'/>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
        
      
    )
}

export default observer(CreateForm)
