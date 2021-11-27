const router = require('express').Router();
const { Post } = require('../models/index');
const validateJWT = require('../middleware/validatejwt');
// const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

router.get('/test', validateJWT, (req, res) => {
    res.send('This is a practice route!')
})

router.post('/create', validateJWT, async (req, res) => {
    const { private, title, image, description, tag } = req.body.post;
    const { id } = req.user;
    console.log(`Owner ID: ${id}`);

    const post = {
        private,
        title,
        image,
        description,
        tag,
        owner_id: id
    }

    try {
        const newPost = await Post.create(post);
        res.status(201).json({
            message: 'Post successfully created',
            post: newPost
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to create post ${err}`
        })
    }
})

module.exports = router;