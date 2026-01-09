import { generateTokenAndSetCookie } from "../lib/utils/generatetoken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"


export const signup = async (req, res) => {

    try {


        const { fullName, username, password, email } = req.body;


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const exisitingUser = await User.findOne({ username })
        if (exisitingUser) {
            return res.status(400).json({ error: "username is already taken" })
        }

        const exisitingEmail = await User.findOne({ email })
        if (exisitingEmail) {
            return res.status(400).json({ error: "email is already taken" })
        }

         if (password.length < 6) {
            return res.status(400).json({ error: "password must be at least 6 characters long" })
        }

        //hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        })
       
        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            })
        } else {
            res.status(400).json({ error: "invalid user data" })
        }
    }

    catch (error) {
        console.log("error in signup controller", error.message)
        res.status(500).json({ error: "internal server error" })

    }
}


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "invalid username or password" })
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            followers: user.followers,
            following: user.email,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        })
    }

    catch (error) {
        console.log("error in login controller", error.message)
        res.status(500).json({ error: "internal server error" })

    }
}


export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "logout succesfully" })
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({ error: "internal server error" })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user);

    }
    catch (error) {
        console.log("error in getMe controller", error.message);
        res.status(500).json({ error: "internal server error" })
    }
}