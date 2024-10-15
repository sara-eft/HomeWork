import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useDebounce from "../../helper/useDebounce"; // import the debounce hook

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    status: "pending",
    type: "",
    duration: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [editIndex, setEditIndex] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Use the debounce hook with 1 second delay

  // Load tasks from Local Storage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to Local Storage whenever tasks change
  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem("tasks")));
  }, [localStorage.getItem("tasks")]);

  const handleAddOrUpdateTask = () => {
    if (newTask.name) {
      if (editIndex !== null) {
        localStorage.setItem(
          "tasks",
          JSON.stringify(
            tasks.map((task, index) =>
              index === editIndex ? { ...task, ...newTask } : task
            )
          )
        );
        setEditIndex(null);
      } else {
        localStorage.setItem(
          "tasks",
          JSON.stringify([
            ...tasks,
            { ...newTask, id: Date.now(), isDone: false },
          ])
        );
      }
      setNewTask({ name: "", status: "pending", type: "", duration: 0 });
    }
  };

  const handleDeleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks.filter((task) => task.id !== id))
    );
    setTasks(newTasks);
  };

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setNewTask({
      name: taskToEdit.name,
      status: taskToEdit.status,
      type: taskToEdit.type,
      duration: taskToEdit.duration,
    });
    setEditIndex(index);
  };

  const handleToggleDone = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, isDone: !task.isDone } : task
    );
    localStorage.setItem(
      "tasks",
      JSON.stringify(
        tasks.map((task, i) =>
          i === index ? { ...task, isDone: !task.isDone } : task
        )
      )
    );
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed" && task.status !== "completed") return false;
    if (filter === "pending" && task.status !== "pending") return false;

    // Check that task name is defined before calling toLowerCase
    return task?.name
      ?.toLowerCase()
      ?.includes(debouncedSearchTerm.toLowerCase() || "");
  });

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ flexGrow: 1 }}>To-Do List</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <TextField
            label="Search"
            variant="outlined"
            style={{
              minWidth: "250px",
              flexGrow: 1,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormControl variant="outlined" style={{ minWidth: "140px" }}>
            <InputLabel id="filter-label">Filter By Status</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter By Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <TextField
          style={{ flex: "1 1 250px", minWidth: "250px" }}
          label="Task Name"
          variant="outlined"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />
        <FormControl variant="outlined" style={{ minWidth: "140px" }}>
          <InputLabel id="task-type-label">Task Type</InputLabel>
          <Select
            labelId="task-type-label"
            value={newTask.type}
            onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
            label="Task Type"
          >
            <MenuItem value="homework">Homework</MenuItem>
            <MenuItem value="cleaning">Cleaning</MenuItem>
            <MenuItem value="work">Work</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Duration (min)"
          variant="outlined"
          type="number"
          style={{ minWidth: "80px" }}
          value={newTask.duration}
          onChange={(e) =>
            setNewTask({ ...newTask, duration: +e.target.value })
          }
        />
        <FormControl variant="outlined" style={{ minWidth: "140px" }}>
          <InputLabel id="task-status-label">Status</InputLabel>
          <Select
            labelId="task-status-label"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            label="Status"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddOrUpdateTask}
          style={{ minWidth: "140px", flexGrow: 1 }}
        >
          {editIndex !== null ? "Update Task" : "Add Task"}
        </Button>
      </div>

      <List style={{ marginTop: "20px" }}>
        {filteredTasks.map((task, index) => (
          <ListItem
            key={task.id}
            style={{ color: task.isDone ? "green" : "black" }}
          >
            <Checkbox
              checked={task.isDone}
              onChange={() => handleToggleDone(index)}
            />
            <ListItemText
              primary={task.name}
              secondary={`Status: ${task.status} | Type: ${task.type} | Duration: ${task.duration} mins`}
            />
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => handleEditTask(index)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteTask(task.id)}
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
