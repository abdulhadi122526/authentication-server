import express from "express"
import { authenticateUser, loggedinUser, logoutUser, regenerateAccessToken, registerUser } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/register" , registerUser)
router.post("/login" , loggedinUser)
router.post("/logout" , logoutUser)
router.post("/regeneratetoken" , regenerateAccessToken)
router.post("/userdata" , authenticateUser , (req , res)=>{
    res.send("you are gatting all user data")
})

export default router;