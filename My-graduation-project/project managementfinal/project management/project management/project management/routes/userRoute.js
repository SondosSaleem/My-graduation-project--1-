const express = require("express")
const {getUserValidator ,createUserValidator  ,updateUserValidator ,
    deleteUserValidator , updateUserPassWordValidator , updateLoggedUserValidator ,} =require("../utils/validators/userValidator")
const {getUsers , getUser, createUser , updateUser ,
    updateUserPassWord, deleteUser ,getLoggedUserData,updateLoggedUserPassword,updateLoggedUserData ,
    deleteLoggedUserData,uploadUserImage , resizeImage, updateProfileImage } = require("../services/userService")

const authService =require("../services/authService")
const router = express.Router()

router.use(authService.protect)
// about me
router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);
router.put('/updateProfileImage', uploadUserImage, resizeImage, updateProfileImage);

router.put("/updatePassword/:id"  , authService.allowedTo('manger') ,
updateUserPassWordValidator,updateUserPassWord)

router.route("/")
.get( authService.allowedTo('manger') ,getUsers)
.post( authService.allowedTo('manger'),
    createUserValidator,createUser);
router.route("/:id")
.get(authService.allowedTo('manger' , 'team leader') ,getUserValidator, getUser)
.put(authService.allowedTo('manger') ,uploadUserImage,
    resizeImage,
    updateUserValidator,updateUser)
.delete(authService.allowedTo('manger') , deleteUserValidator,deleteUser)


module.exports = router