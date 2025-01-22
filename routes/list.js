const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");

// Add a task
router.post("/addTask", async (req, res) => {
  try {
    const { title, body, id } = req.body;
    const existingUser = await User.findById(id);

    if (existingUser) {
      const list = new List({ title, body, user: existingUser });
      await list.save().then(() => res.status(200).json({ list }));
      existingUser.list.push(list);
      existingUser.save();
    }
  } catch (error) {
    console.log(error);
  }
});

// Update a task
router.put("/updateTask/:id", async (req, res) => {
  try {
    const { title, body } = req.body;

    // Find the task by its ID
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task with the new title and body
    list.title = title || list.title;
    list.body = body || list.body;

    // Save the updated task to the database
    await list.save();

    res.status(200).json({ message: "Task updated successfully", list });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a task
router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { id } = req.params; // Use params for the task ID.

    // Find and update the user to remove the task reference
    const task = await List.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const existingUser = await User.findByIdAndUpdate(
      task.user, // Use the `user` field in the task to locate the user
      { $pull: { list: id } }, // Remove the task reference from the user's list
      { new: true } // Return the updated user document
    );

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the task itself
    await List.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all tasks for a user
router.get("/getTask/:id", async (req, res) => {
  try {
    const list = await List.find({ user: req.params.id }).sort({ createdAt: -1 });
    if (list.length !== 0) {
      res.status(200).json({ list });
    } else {
      res.status(200).json({ message: "No Task" });
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
