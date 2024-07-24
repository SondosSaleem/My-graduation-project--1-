const asyncHandler = require('express-async-handler')
const ApiError = require("../utils/apiError")
const teamModel = require("../models/teamModel")
const userModel = require("../models/userModel")


// manger
exports.createTeam = asyncHandler(async (req, res, next) => {
    const { members, teamLeader } = req.body;
    
    // Create the team
    const team = await teamModel.create(req.body);
  
    // Update members with the team ID
    if (members) {
      await Promise.all(members.map(async (member) => {
        await userModel.findByIdAndUpdate(
          { _id: member },
          { team: team._id },
          { new: true }
        );
      }));
    }
  
    // Update the team leader with the team ID
    if (teamLeader) {
      await userModel.findByIdAndUpdate(
        { _id: teamLeader },
        { team: team._id },
        { new: true }
      );
    }
  
    // Populate the team with members' names and team leader's name
    const populatedTeam = await teamModel.findById(team._id)
      .populate('members', 'name') // Populate the members field with only the name field
      .populate('teamLeader', 'name'); // Populate the teamLeader field with only the name field
  
    // Return the populated team
    res.status(200).json({ message: "Done successfully", data: populatedTeam });
  });

// manger
exports.getTeams = asyncHandler(async (req, res , next) => {
    const teams = await teamModel.find()
        .populate('teamLeader', 'name _id progress profileImg') // Populate member details (name and _id)
        .populate('members', 'name _id progress profileImg') // Populate member details (name and _id)
        .populate('manager', 'name _id progress profileImg'); // Populate manager details
        res.status(200).json({message: "Done successfully" ,numberOfTeam:teams.length, data: teams})
        })
        
        
        // manger
        exports.getTeam = asyncHandler(async (req , res , next) =>{
          const {id} = req.params
          const team = await teamModel.findById(id)
          .populate('teamLeader', 'name _id progress profileImg') // Populate member details (name and _id)
          .populate('members', 'name _id progress profileImg') // Populate member details (name and _id)
          .populate('manager', 'name _id progress profileImg'); // Populate manager details
          if(!team){
        return next(new ApiError('team Not Found', 401))
    }
    res.status(200).json({message :"Done Successfully",data :team });
})

// team leader - member
exports.getMyTeam = asyncHandler(async (req, res, next) => {
    try {
      const team = await teamModel.findById({ _id: req.user.team }).populate('teamLeader members');
      if (!team) {
        return next(new ApiError('Team not found', 404));
      }
      res.status(200).json({ message: 'Done Successfully', data: team });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// manger
exports.updateTeamTitle = asyncHandler(async (req, res , next) => {
    const {id} = req.params
    const team = await teamModel.findByIdAndUpdate({_id: id},{title : req.body.title},{new: true})
    if(!team){
        return next(new ApiError('team Not Found', 401))
    }
    res.status(200).json({message: "Done successfully" , data: team})
})


// manger
exports.addMember =asyncHandler(async (req, res , next) => {
    const {id} = req.params
    const {members}=req.body
    const team = await teamModel.findByIdAndUpdate({_id: id},{$addToSet :{members: members}},{new: true})
    if(!team){
        return next(new ApiError('team Not Found', 401))
    }
    members.map(async(member)=>{
        await userModel.findByIdAndUpdate({_id:member},{team:team._id},{new: true})
    })
    res.status(200).json({message: "Done successfully" , data: team})
})

exports.addTeamLeader =asyncHandler(async (req, res , next) => {
    const {id} = req.params
    const {teamLeader} = req.body
    const team = await teamModel.findByIdAndUpdate({_id: id},{teamLeader: teamLeader},{new: true})
    if(!team){
        return next(new ApiError('team Not Found', 401))
    }
    await userModel.findByIdAndUpdate({_id: teamLeader}, {team:team._id}, {new: true})
    res.status(200).json({message: "Done successfully" , data: team})
})

exports.deleteMember =asyncHandler(async (req, res , next) => {
    const {id} = req.params
    const {members} = req.body
    const team = await teamModel.findById(id)
    if(!team){
        return next(new ApiError('team Not Found', 401))
    }
    team.members = team.members.filter(val => !members.includes(val.toString()));
    await team.save();
    
    members.map(async (member)=>{
        await userModel.findByIdAndUpdate({_id: member}, {team:null}, {new: true})
    })
    res.status(200).json({message: "Done successfully" , data: team})
})

exports.deleteTeamLeader =asyncHandler(async (req, res , next) => {
    const {id} = req.params
    const {teamLeader} = req.body
    const team = await teamModel.findByIdAndUpdate({_id:id} , {teamLeader:null} , {new:true})
    if(!team){
        return next(new ApiError('team Not Found', 401))
    }
    await userModel.findByIdAndUpdate({_id:teamLeader},{team:null},{new : true})
    res.status(200).json({message: "Done successfully" , data: team})
})

// manger
exports.deleteTeam = asyncHandler(async (req, res , next) => {
    const {id} = req.params
    const team = await teamModel.findByIdAndDelete(id)
    if(!team){
        return next(new ApiError('team Not Found', 401))
    }
    if(team.teamLeader){
        await userModel.findByIdAndUpdate({_id:team.teamLeader},{team:null},{new:true})
    }
    if(team.members){
        team.members.map(async (member)=>{
            await userModel.findByIdAndUpdate({_id:member},{team:null},{new:true})
        })
    }
    res.status(200).json({message: "Done successfully"})
})
