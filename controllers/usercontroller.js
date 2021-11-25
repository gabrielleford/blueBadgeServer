const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// { "user" : { "email" : "test@test.com", "password" : "password"}}
// 

router.post("/register", async (req, res) => {
    let { email, password } = req.body.user;
    try {
        const user = await User.create({
            email,
            passwordhash: bcrypt.hashSync(password, 13)
        });
        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
        res.status(201).json({
            message: "User successfully created",
            email: email,
            sessionToken: token,
            user_id: user_id
        });
    } catch (error) {
        res.status(500).json({
            message: `Error: ${error}`
        });
    }
});

module.exports = router;