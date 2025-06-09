const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

//Get Tasks
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }); 
  res.json(tasks);
});

//Create Task
router.post('/', auth, async (req, res) => {
  const { title } = req.body;
  const task = await Task.create({ user: req.user.id, title });
  res.status(201).json(task);
});

//Update Task
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task Not Found' });
        }

        if (req.body.title) {
            task.title = req.body.title;
        }
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

        await task.save();
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


//Delete Task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
