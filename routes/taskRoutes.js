const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

//Get Tasks
router.get('/', auth, async (req, res) => {
    const tasks = await Task.find({user: req.user.id});
    res.json(tasks);
});

//Create Task
router.post('/', auth, async (req, res) => {
    const {title} = req.body;
    const task = await Task.create({ user: req.user.id, title});
    res.status(201).json(task);
});

//Update Task
router.put('/:id', auth, async(req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id){
        return res.status(404).json({message: "Task Not Found"});
    }

    task.completed = !task.completed;
    await task.save();
    res.json(task);
});

//Delete Tas
router.delete('/:id', auth, async(req, res) => {
    const task = await Task.findById(req.params.id);
    if(!task || task.user.toString() !== req.user.id){
        return res.status(404).json({message: "Task Not Found"});
    }

    await task.remove();
    res.json({message: "Task Deleted"});
});

module.exports = router;
