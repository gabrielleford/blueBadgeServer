const router = require("express").Router();
const { User } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// { "user" : { "email" : "test@test.com", "password" : "password"}}
// 

router.post("/register", async (request, response) => {
    // let { email, password } = request.body.user;

    // try {
    //     const user = await User.create({
    //         email,
    //         passwordhash: bcrypt.hashSync(password, 13)
    //     });

    //     let token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

    //     response.status(201).json({
    //         message: "User successfully created",
    //         email: email,
    //         sessionToken: token,
    //         user_id: user_id
    //     });
    // } catch (error) {
    //     if (error instanceof UniqueConstraintError) {
    //         response.status(409).json({
    //             message: "Email already in use",
    //         });
    //     } else
    //         response.status(500).json({
    //             message: "Failed to register user",
    //         });
    // }
    response.status(200).json({ message: 'Success' })
});

module.exports = router;