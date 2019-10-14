import React from 'react'
import {Menu, Container, Button} from 'semantic-ui-react'
import {NavLink} from 'react-router-dom';

const NavBar = () => {
    return (
      <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          Task Management
        </Menu.Item>
        <Menu.Item
          name="Tasks"
          as={NavLink}
          exact
          to='/tasks'
        />
        <Menu.Item>
          <Button 
            color="yellow"
            content='Modify Priority'
            as={NavLink}
            to='/tasks/priority'
          />
        </Menu.Item>
        <Menu.Item>
          <Button
            positive
            content='Add Task'
            as={NavLink}
            to='/createTask'
          />
        </Menu.Item>
        <Menu.Item>
          <Button 
            positive
            content='Add Status'
            to='/createState'
            as={NavLink}
          />
        </Menu.Item>
      </Container>
    </Menu>
    )
}

export default NavBar
