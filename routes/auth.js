import express from "express"
import User from "../models/User.js"
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/register", async(req, res) => {
    const newUser = new User({
        email: req.body.email,
        isAdmin: req.body.admin,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_WORD).toString()
    })

    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);

    } catch (err) {
        res.status(500).json(err)
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(401).json('Wrong credentials!');

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_WORD);

        const realPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        realPassword !== req.body.password && res.status(401).json('Wrong credentials!');

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_PASSWORD,
            {expiresIn:"3d"}
        );
         
        const { password, ...others } = user._doc;
        res.status(200).json({...others,accessToken});
    } catch (err) {
        res.status(500).json(err);
    }
})


export default router;