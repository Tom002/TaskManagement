import React, { Fragment, useContext } from 'react'
import { ITask } from '../../app/models/ITask'
import {Card, Button, Icon} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import {observer} from 'mobx-react-lite';
import TaskStore from '../../app/stores/taskStore';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Moment from 'react-moment';

//background-color: ${(props: any) => (props.isDragging ? 'lightgreen': 'white')};

const TaskContainer = styled.div`
    margin-bottom: 8px;
`;

const getColor = (isDragging: Boolean) => {
  if(isDragging) {
      return 'lightgreen';
  }
  return 'white';
}

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
      <Draggable draggableId={String(task.id)} index={task.order}>
        {(provided,snapshot) => (
          <TaskContainer
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
              <Card key={task.id} style={{backgroundColor: getColor(snapshot.isDragging)}}>
                <Card.Content>
                  {
                    <a className={"right floated ui blue circular label big"}>
                      {task.order}
                    </a>
                  }
                  <Card.Header>{task.title}</Card.Header>
                  <Card.Meta> 
                  <Moment format="YYYY/MM/DD">
                    {String(task.deadline)}
                  </Moment>
                  </Card.Meta>
                  <Card.Description>{task.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className="ui two buttons">
                    <Button
                      negative
                      name={task.id}
                      loading={submitting && target === task.id}
                      onClick={e => {
                        deleteTask(e, task.id);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      positive
                      as={Link}
                      to={`/manageTask/${task.id}`}
                      floated="right"
                    >
                      Edit
                    </Button>
                  </div>
                </Card.Content>
              </Card>
          </TaskContainer>
        )}
      </Draggable>
    );
}

export default observer(TaskCard) 

