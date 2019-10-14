import React, { useContext, useState } from 'react'
import { Grid, Card, Button, Confirm } from 'semantic-ui-react'
import TaskCard from './TaskCard'
import TaskStore from '../../app/stores/taskStore';
import {observer} from 'mobx-react-lite';

const TasksGrid :React.FC = () => {

    const taskStore = useContext(TaskStore);
    const {stateRegistry, tasksByOrder, deleteState} = taskStore;

    //const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <Grid columns='equal' style={{marginTop: '2em'}}>
          {Array.from(stateRegistry.values()).map(state => (
            <Grid.Column>
              <Card>
                <Card.Content>
                  <Card.Header>
                    {state.name}
                    <Button 
                      className={"right floated tiny"}
                      onClick={() => deleteState(state.id)}
                      basic
                      color="red">
                         Delete status
                    </Button>
                  </Card.Header>
                </Card.Content>
              </Card>
              {tasksByOrder.filter(a => a.stateId === state.id).map(task =>(
                <TaskCard task={task}/>
              ))}
            </Grid.Column>
          ))}
      </Grid>
    )
}

export default observer(TasksGrid)
