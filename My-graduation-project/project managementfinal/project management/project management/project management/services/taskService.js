const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const Event = require('../models/Event'); 
const {
  createNotificationOneToOne,
} = require("../services/notificationService");

// @desc Create Task
// @Route Post /api/v1/tasks
// @access Privet
// Your existing task creation function
const createTask = asyncHandler(async (req, res) => {
  try {
    req.body.team = req.user.team;
    req.body.teamLeader = req.user._id;

    // Create the task
    const task = await Task.create(req.body);

    // Trigger "save" event when creating the task
    task.save();

    // Send a one-to-one notification
    const notificationParams = {
      from: req.user._id,
      to: req.body.member, // Replace with the actual user ID you want to send the notification to
      message: "New task created: " + task.title, // Adjust the notification message
    };

    await createNotificationOneToOne(
      notificationParams.from,
      notificationParams.to,
      notificationParams.message
    );

    res.status(200).json({ message: "Task added successfully", data: task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const createEvent = asyncHandler(async (req, res) => {
  try {
    // Extract necessary fields from the request body
    const { title, startDate, deadline } = req.body;

    // Create the event
    const event = await Event.create({ title, startDate, deadline });

    // Trigger "save" event when creating the event
    event.save();

    res.status(200).json({ message: "Event added successfully", data: event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// @desc Find some Tasks
// @Route Get /api/v1/tasks
// @access public
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ teamLeader: req.user._id })
    .populate("member", "name _id") // Populate member details (name and _id)
    .populate("teamLeader", "name _id"); // Optionally populate team leader details

  res
    .status(200)
    .json({
      message: "Done Successfully",
      totalTasks: tasks.length,
      Tasks: tasks,
    });
});

// @desc Find Task
// @Route Get /api/v1/tasks:id
// @access public
const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.find({ _id: id });
  res.status(200).json({ message: "Done Successfully", task: task });
});

const getTasksForOneMember = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const memberTasks = await Task.find({
    member: id,
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  });
  res.status(200).json({
    message: "Done Successfully",
    totalTasks: memberTasks.length,
    Tasks: memberTasks,
  });
});

// // @desc Update Task
// // @Route Put /api/v1/Task:id
// // @access public [Update]
const updateTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findByIdAndUpdate(
    { _id: id },
    {
      description: req.body.description,
      title: req.body.title,
      status: req.body.newStatus,
    },
    { new: true }
  );
  if (!task) {
    return next(new ApiError(`task Not Found`, 404));
  }
  res.status(200).json({ message: "Done Successfully", data: task });
});

// // @desc Delete Task
// // @Route Delete /api/v1/Task:id
// // @access public
const deleteTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return next(new ApiError(`task Not Found`, 404));
  }
  // Trigger "remove" event when update task
  task.remove();
  res.status(200).json({ message: "Done Successfully" });
});

const completeTask = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findByIdAndUpdate(
    { _id: id },
    { done: true, status: "completed" },
    { new: true }
  );
  if (!task) {
    throw new Error("No Task Found With this Id");
  }
  res.status(200).json({ message: "Done Successfully", task: task });
});

const getMyTasks = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const memberTasks = await Task.find({
    member: req.user._id,
    done: false,
    deadline: { $gte: today },
  });
  res.status(200).json({
    message: "Done Successfully",
    totalTasks: memberTasks.length,
    Tasks: memberTasks,
  });
});

const overdueTasks = asyncHandler(async (req, res, next) => {
  const today = new Date(); // 4 < 5
  today.setHours(0, 0, 0, 0); // deadline < today
  const memberTasks = await Task.find({
    teamLeader: req.user._id,
    done: false,
    deadline: { $lt: today },
  });
  memberTasks.forEach(async (task) => {
    task.status = "overdue";
    await task.save();
  });
  /* const task = await Task.findByIdAndUpdate({_id:req.user._id},{status: 'overdue'},{new:true})
    if(!task){
        throw new Error('No Task Found With this Id')
      } */
  res
    .status(200)
    .json({
      message: "Done Successfully",
      overdueTasks: memberTasks.length,
      Tasks: memberTasks,
    });
});

const overdueTasksForMember = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const memberTasks = await Task.find({
    member: req.user._id,
    done: false,
    deadline: { $lt: today },
  });
  res
    .status(200)
    .json({
      message: "Done Successfully",
      overdueTasks: memberTasks.length,
      Tasks: memberTasks,
    });
});

const inProgress = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); //  createdAt < today // deadline >= today  // (startDate < today < deadline)
  const memberTasks = await Task.find({
    teamLeader: req.user._id,
    done: false,
    startDate: { $lte: today },
    deadline: { $gte: today },
  });
  memberTasks.forEach(async (task) => {
    task.status = "inProgress";
    await task.save();
  });
  /* const task = await Task.findByIdAndUpdate({_id:req.task._id},{status: 'inProgress'},{new:true})
    if(!task){
        throw new Error('No Task Found With this Id')
      } */
  res
    .status(200)
    .json({
      message: "Done Successfully",
      inProgress: memberTasks.length,
      Tasks: memberTasks,
    });
});


const inProgressForMember = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const memberTasks = await Task.find({
    member: req.user._id,
    done: false,
    createdAt: { $lt: today },
    deadline: { $gte: today },
  });
  res.status(200).json({
    message: "Done Successfully",
    inProgress: memberTasks.length,
    Tasks: memberTasks,
  });
});

const getCompletedTasks = asyncHandler(async (req, res, next) => {
  const memberTasks = await Task.find({ tramLeader: req.user._id, done: true });
  res.status(200).json({
    message: "Done Successfully",
    completedTasks: memberTasks.length,
    Tasks: memberTasks,
  });
});

const getCompletedTasksForMember = asyncHandler(async (req, res, next) => {
  const memberTasks = await Task.find({ member: req.user._id, done: true });
  res.status(200).json({
    message: "Done Successfully",
    completedTasks: memberTasks.length,
    Tasks: memberTasks,
  });
});

const getDailyTasksTeam = asyncHandler(async (req, res, next) => {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(); // startDate < createdAt < endDate
  endDate.setHours(23, 59, 59, 999);
  const memberTasks = await Task.find({
    teamLeader: req.user._id,
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  res.status(200).json({
    message: "Done Successfully",
    totalTasks: memberTasks.length,
    Tasks: memberTasks,
  });
});

const getDailyTasksForMember = asyncHandler(async (req, res, next) => {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(); // startDate < createdAt < endDate
  endDate.setHours(23, 59, 59, 999);
  const memberTasks = await Task.find({
    member: req.user._id,
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  res.status(200).json({
    message: "Done Successfully",
    totalTasks: memberTasks.length,
    Tasks: memberTasks,
  });
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getDailyTasksTeam,
  getDailyTasksForMember,
  inProgressForMember,
  getCompletedTasksForMember,
  getTasksForOneMember,
  getCompletedTasks,
  overdueTasks,
  overdueTasksForMember,
  getMyTasks,
  inProgress,
  completeTask,
  createEvent,
};
