import React, { useState, FormEvent, useContext, useEffect } from "react";
import { ITask } from "../../app/models/ITask";
import {
  Segment,
  Form,
  Button,
  Dropdown,
  Grid,
  DropdownProps
} from "semantic-ui-react";
import { RouteComponentProps } from "react-router";
import TaskStore from "../../app/stores/taskStore";
import { observer } from "mobx-react-lite";

interface DetailParams {
  id: string;
}

const TaskForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const taskStore = useContext(TaskStore);
  const {
    loadTask,
    selectedTask,
    clearTask,
    editTask,
    loadStates,
    stateRegistry,
    statesForDropdown,
    submitting,
    target
  } = taskStore;

  useEffect(() => {
    console.log("afdsa");
    if (match.params.id) {
      let id = Number(match.params.id);
      console.log(id);
      if (isNaN(id)) {
        history.push("/notfound");
      } else {
        loadTask(id).then(() => selectedTask && setTask(selectedTask));
      }
      return () => {
        clearTask();
      };
    }

    if (stateRegistry.size === 0) {
      loadStates();
    }
  }, [loadTask, selectedTask, clearTask, match.params.id]);

  const [task, setTask] = useState<ITask>({
    id: 0,
    title: "",
    description: "",
    deadline: "",
    stateId: 0,
    order: 0
  });

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setTask({ ...task, [name]: value });
  };

  const handleDropdownChange = (event: any, data: DropdownProps) => {
    console.log(task.stateId);
    if (data.value) {
      setTask({ ...task, ["stateId"]: Number(data.value) });
    }
  };

  const handleSubmit = () => {
    editTask(task).then(() => history.push("/tasks"));
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing style={{ marginTop: "3.5em" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              onChange={handleInputChange}
              name="title"
              placeholder="Title"
              value={task.title}
            />
            <Form.TextArea
              onChange={handleInputChange}
              name="description"
              placeholder="Description"
              value={task.description}
            />
            <Form.Input
              onChange={handleInputChange}
              name="deadline"
              placeholder="Deadline"
              type="date"
              value={task.deadline}
            />
            <Dropdown
              placeholder="State"
              selection
              options={statesForDropdown}
              value={task.stateId}
              onChange={handleDropdownChange}
            />
            <Button
              loading={submitting && target === task.id}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              onClick={() => {
                history.push("/tasks");
              }}
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(TaskForm);
