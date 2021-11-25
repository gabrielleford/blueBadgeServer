const router = require('express').Router();
const { User } = require('../models');
const { UniqueConstraintError } = require('sequelize/lib/errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// { "user" : { "email" : "test3@test.com", "password" : "password"}}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNmNDVhODQ2LWI3YjgtNGIyMy1hNjgwLWQxYWY5MmI5YTk4MCIsImlhdCI6MTYzNzg3Njg4MiwiZXhwIjoxNjM3OTYzMjgyfQ.qyV6ehy0_pKmG0kG2qJ0NlT9fL8c1kMDs5DJuQ5IRWg

router.post('/register', async (request, response) => {
    let { email, password } = request.body.user;

    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    if (!email.match(emailRegex)) return response.status(400).json({ message: 'Email not valid' })

    try {
        const user = await User.create({
            email,
            passwordhash: bcrypt.hashSync(password, 13)
        });

        let token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        response.status(201).json({
            message: 'User successfully created',
            email: email,
            sessionToken: token,
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            response.status(409).json({
                message: 'Email already in use',
            });
        } else
            response.status(500).json({
                message: `Failed to register user. ${error}`,
            });
    }
});

router.post("/login", async (request, response) => {
    let { email, password } = request.body.user;

    try {
        const loginUser = await User.findOne({
            where: {
                email: email,
            },
        });

        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.passwordhash);
            if (passwordComparison) {
                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                response.status(200).json({
                    user: loginUser,
                    message: 'User successfully logged in!',
                    sessionToken: token
                });
            } else {
                response.status(401).json({
                    message: 'Incorrect email or password'
                })
            }
        } else {
            response.status(401).json({
                message: 'Incorrect email or password'
            });
        }
    } catch (error) {
        response.status(500).json({
            message: `Failed to log user in. ${error}`
        })
    }
});

module.exports = router;