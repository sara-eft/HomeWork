import React, { useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const TodoList = () => {
  // Specify the type of tasks as string[]
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const handleAddTask = () => {
    if (task) {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>To-Do List</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <TextField
          label="Add a new task"
          variant="outlined"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddTask}>
          Add Task
        </Button>
      </div>
      <List>
        {tasks.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item} />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteTask(index)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TodoList;
