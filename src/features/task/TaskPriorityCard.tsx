import React from 'react'
import { ITask } from '../../app/models/ITask'
import { Card } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { Draggable } from 'react-beautiful-dnd';

 
interface IProps {
    key: number,
    index: number,
    item: ITask;
}

const TaskPriorityCard : React.FC<IProps> = ({item, key, index}) => {
    return (
        <Draggable draggableId={String(item.id)} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <Card>
                    <Card.Content>
                        {<a className={"right floated ui blue circular label big"}>{item.order}</a>}
                        <Card.Header>{item.title}</Card.Header>
                        <Card.Meta>{item.deadline}</Card.Meta>
                        <Card.Description>
                            {item.description}
                        </Card.Description>
                    </Card.Content>
                    </Card>

                </div>
            )

            }
            
        </Draggable>
            
    )
}

export default observer(TaskPriorityCard)
