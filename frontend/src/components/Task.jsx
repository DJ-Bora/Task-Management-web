import React, { useEffect, useState, useCallback } from "react";
import "./Task.css";
import TodoCards from "./TodoCards";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Update from "./Update";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || `${window.location.origin}/api/v2`;
const id = sessionStorage.getItem("id");

const Task = () => {
  const [Inputs, setInputs] = useState({ title: "", body: "", textareaVisible: false });
  const [Array, setArray] = useState([]);
  const [toUpdate, setToUpdate] = useState(null);

  // Show the textarea when the title input is clicked
  const show = () => setInputs((prev) => ({ ...prev, textareaVisible: true }));

  // Handle input changes
  const change = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // Submit a new task
  const submit = async () => {
    const { title, body } = Inputs;

    if (!title || !body) {
      toast.error("Title and Body cannot be empty!");
      return;
    }

    if (id) {
      try {
        await axios.post(`${API_BASE_URL}/addTask`, { title, body, id });
        toast.success("Your Task was added successfully!");
        setInputs({ title: "", body: "", textareaVisible: false });
        fetchTasks();
      } catch (error) {
        handleError(error);
      }
    } else {
      toast.error("Please sign up first!");
    }
  };

  // Delete a task
  const del = async (Cardid) => {
    if (id) {
      try {
        await axios.delete(`${API_BASE_URL}/deleteTask/${Cardid}`, { data: { id } });
        toast.success("Task deleted successfully!");
        fetchTasks();
      } catch (error) {
        handleError(error);
      }
    } else {
      toast.error("Please sign up first!");
    }
  };

  // Display or hide the update modal
  const dis = (value) => {
    const modal = document.getElementById("todo-update");
    if (modal) modal.style.display = value;
  };

  // Set the task to update
  const update = (value) => setToUpdate(Array[value]);

  // Fetch tasks from the API
  const fetchTasks = useCallback(async () => {
    if (!id) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/getTask/${id}`);
      setArray(response.data.list || []);
    } catch (error) {
      handleError(error);
    }
  }, []);

  // Error handler
  const handleError = (error) => {
    console.error(error);
    toast.error(error.response?.data?.message || "An unexpected error occurred.");
  };

  // Auto-refresh tasks every 10 seconds
  useEffect(() => {
    fetchTasks();

    const intervalId = setInterval(fetchTasks, 10000);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchTasks]);

  return (
    <>
      <div className="todo">
        <ToastContainer />
        <div className="todo-main container d-flex justify-content-center align-items-center my-4 flex-column">
          <div className="d-flex flex-column todo-inputs-div w-lg-50 w-100 p-1">
            <input
              type="text"
              placeholder="TITLE"
              className="my-2 p-2 todo-inputs"
              onClick={show}
              name="title"
              value={Inputs.title}
              onChange={change}
              aria-label="Task Title"
            />
            {Inputs.textareaVisible && (
              <textarea
                placeholder="BODY"
                name="body"
                className="p-2 todo-inputs"
                value={Inputs.body}
                onChange={change}
                aria-label="Task Body"
              />
            )}
          </div>
          <div className="w-50 w-100 d-flex justify-content-end my-3">
            <button className="home-btn px-2 py-1" onClick={submit} aria-label="Add Task">
              Add
            </button>
          </div>
        </div>
        <div className="todo-body">
          <div className="container-fluid">
            <div className="row">
              {Array.map((item, index) => (
                <div className="col-lg-3 col-11 mx-lg-5 mx-3 my-2" key={index}>
                  <TodoCards
                    title={item.title}
                    body={item.body}
                    id={item._id}
                    delid={del}
                    display={dis}
                    updateId={index}
                    toBeUpdate={update}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="todo-update" id="todo-update">
        <div className="container update">
          <Update display={dis} update={toUpdate} />
        </div>
      </div>
    </>
  );
};

export default Task;
