const express = require("express")
const User = require("../model/user")
const requireLogin = require("../middleware/requireLogin")
const Post = require("../model/post")

const router = express.Router()

router.get("/user/:id",requireLogin,(req,res) => {
User.findOne({_id:req.params.id})
.select("-password")
.then(user => {
    Post.find({postedBy:req.params.id})
    .populate("postedBy","_id name")
    .then(result => {
        return res.status(200).json({user,result})
    })
})
})

router.put("/follow",requireLogin,(req,res) => {
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    })
    .then(result => {
        User.findByIdAndUpdate(req.user._id,{
            $push:{followings:req.body.followId}
        },{
            new:true
        })
        .then(myresult => res.json(myresult))
    })
})
router.put("/unfollow",requireLogin,(req,res) => {
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    })
    .then(result => {
        User.findByIdAndUpdate(req.user._id,{
            $pull:{followings:req.body.unfollowId}
        },{
            new:true
        })
        .then(myresult => res.json(myresult))
    })
})

module.exports = router