const router = require('express').Router();
const User = require('../models/User');
import { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } from "../config/verifyToken.js"
const CryptoJS = require("crypto-js");

//EDIT USER
router.put("/:id",verifyTokenAndAuth, async(req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_WORD).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true})
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(500).json(err)
    }
})

//DELETE USER
router.delete('/:id', verifyTokenAndAuth, async(req, res) => {
    try {
        await User.findByIdAndDelete(  req.params.id );
        res.status(200).json(" User has been deleted");
    } catch(err) {
        res.status(500).json(err)
    }
})

//GET A USER
router.get('/find/:id', verifyTokenAndAdmin, async(req, res) => {
    try {
        const user = await User.findById(  req.params.id );
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch(err) {
        res.status(500).json(err)
    }
})
//GET ALL USERS
router.get('/', verifyTokenAndAdmin, async(req, res) => {
    const query = req.query.new;
    try {
        const users = query 
        ? await User.find().sort({_id: -1 }).limit(5) 
        : await User.find();
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json(err)
    }
})



export default router