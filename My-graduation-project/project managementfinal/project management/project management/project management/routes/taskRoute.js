const express = require("express")
const {createTaskValidator ,getTaskValidator  ,updateTaskValidator , deleteTaskValidator ,completeTaskValidator , getTasksForMemberValidator} =require("../utils/validators/taskValidator")
const {getTasks , createTask , getTask , updateTask ,
    deleteTask ,getMyTasks,getTasksForOneMember ,completeTask ,
    getDailyTasksTeam ,overdueTasks, getCompletedTasks ,inProgress, createEvent} = require("../services/taskService")
const Authorization = require("../services/authService")

const router = express.Router()

router.use(Authorization.protect)

router.get("/getMyTasks/" , Authorization.allowedTo('member', 'team leader') ,getMyTasks)

router.get("/getTasksForOneMember/:id" , Authorization.allowedTo('team leader', 'member', 'manger') ,getTasksForMemberValidator,getTasksForOneMember)

router.get("/getDailyTasksTeam/" , Authorization.allowedTo('team leader') ,getDailyTasksTeam)

router.get("/getCompletedTasks/" , Authorization.allowedTo('team leader','member') ,getCompletedTasks)

router.get("/overdueTasks/" , Authorization.allowedTo('team leader','member') ,overdueTasks)

router.get("/inProgress/" , Authorization.allowedTo('team leader','member') ,inProgress)

router.patch("/completeTask/:id" , Authorization.allowedTo('member') , completeTask)

router.route("/")
.get(Authorization.allowedTo('team leader'),getTasks)
.post(Authorization.allowedTo('team leader') ,createTaskValidator,createTask);

router.route("/:id")
.get(getTaskValidator, getTask)
.patch(Authorization.allowedTo('team leader'),updateTaskValidator,updateTask)
.delete(Authorization.allowedTo('team leader') ,deleteTaskValidator,deleteTask)

router.post('/create-event', Authorization.allowedTo('manger'), createEvent);

module.exports = router