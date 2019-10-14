import React, { Fragment, useContext } from 'react'
import { ITask } from '../../app/models/ITask'
import {Card, Button, Icon} from 'semantic-ui-react'
import { NavLink, Link } from 'react-router-dom'
import {observer} from 'mobx-react-lite';
import TaskStore from '../../app/stores/taskStore';

interface IProps {
    task: ITask;
}

const TaskCard : React.FC<IProps> = (
    {
        task
    }) => {
        const taskStore = useContext(TaskStore);
        const {deleteTask, submitting, target} = taskStore;

    return (
        <Fragment>
            <Card>
                <Card.Content>
                    {<a className={"right floated ui blue circular label big"}>{task.order}</a>}
                  <Card.Header>
                    {task.title}
                  </Card.Header>
                  <Card.Meta>Deadline: {task.deadline}</Card.Meta>
                  <Card.Description>
                    {task.description}
                  </Card.Description> 
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button
                            basic
                            color='red'
                            name={task.id}
                            loading={submitting && target === task.id}
                            onClick={(e) => {
                                deleteTask(e,task.id)}
                            }>
                            <span><Icon name='trash alternate outline' size='big'></Icon></span>
                            
                        </Button>
                        <Button
                            basic
                            color='green'
                            as={Link}
                            to={`/manageTask/${task.id}`}
                            floated='right'>
                            <Icon fitted name="edit" size="big"></Icon>
                        </Button>
                    </div>
                </Card.Content>
            </Card>
        </Fragment>
    )
}

export default observer(TaskCard) 

