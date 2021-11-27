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


// * Create post *
// http://localhost:3000/post/create
// {"post" {"private": "false", "title": "fur baby", "image": "some img url", "description": "description of fur baby", "tag": "fur baby"}}
router.post('/create', validateJWT, async (req, res) => {
    const { private, title, image, description, tag } = req.body.post;
    const id  = req.user_id;
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

// * Get all public posts *
// http://localhost:3000/post/
router.get('/', async (req, res) => {
    try {
        const publicPosts = await Post.findAll({
            where: {
                private: false
            }
        });

        res.status(200).json(publicPosts);
    } catch (err) {
        res.status(500).json({
            error: `Error: ${err}`
        });
    }
});

// * Get all user posts *
// http://localhost:3000/post/myposts
router.get('/myposts', validateJWT, async (req, res) => {
    const id = req.user_id;

    try {
        const userPosts = await Post.findAll({
            where: {
                owner_id: id
            }
        });

        res.status(200).json(userPosts);
    } catch (err) {
        res.status(500).json({
            err: `Error: ${err}`
        });
    }
});

// * Get other users' public posts
// http://localhost:3000/post/posts/:userid
router.get('/posts/:userid', async (req, res) => {
    const id = req.params.userid;

    try {
        const userPosts = await Post.findAll({
            where: {
                private: false,
                owner_id: id
            }
        });

        res.status(200).json(userPosts);
    } catch (err) {
        res.status(500).json({
            error: `Error: ${err}`
        });
    }
});

// * Get post by id *
// http://localhost:3000/post/:id
router.get('/:id', validateJWT, async (req, res) => {
    const postId = req.params.id;
    const id = req.user_id;

    try {
        const postById = await Post.findAll({
            where: {
                id: postId,
                owner_id: id
            }
        });

        res.status(200).json(postById);
    } catch (err) {
        res.status(500).json({ error: `Error: ${err}`});
    }
});

// * Update post *
// http://localhost:3000/edit/:id
// {"post" {"private": "false", "title": "fur baby", "image": "some img url", "description": "updated description", "tag": "fur baby"}}
router.put('/edit/:id', validateJWT, async (req, res) => {
    const { private, title, image, description, tag } = req.body.post;
    const postId = req.params.id;
    const id = req.user_id;

    const updatedPost = {
      private,
      title,
      image,
      description,
      tag,
      owner_id: id,
    };

    const postOwner = await Post.findAll({
      where: {
        id: postId
      },
    });

    if (JSON.parse(JSON.stringify(postOwner))[0].owner_id === id) {
        const query = {
            where: {
                id: postId,
                owner_id: id
            }
        };

        try {
            const updated = await Post.update(updatedPost, query);

            res.status(200).json({
                message: 'Post updated',
                updatedPost: updatedPost
            })
        } catch (err) {
            res.status(500).json({
                err: `Error ${err}`
            });
        }
    } else {
        res.status(403).json({
            err: 'You can only update your own logs'
        });
    }
});

// * Delete post *
// http://localhost:3000/delete/:id
router.delete('/delete/:id', validateJWT, async (req, res) => {
    const postId = req.params.id;
    const id = req.user_id;

    const postOwner = await Post.findAll({
        where: {
            id: postId,
        }
    });

    if (JSON.parse(JSON.stringify(postOwner))[0].owner_id === id) {
        const query = {
            where: {
                id: postId,
                owner_id: id
            }
        };

        try {
            await Post.destroy(query);

            res.status(200).json({
                message: 'Post deleted'
            })
        } catch (err) {
            res.status(500).json({
                err: `Error ${err}`
            });
        }
    } else {
        res.status(403).json({
            err: 'You can only delete your own logs'
        });
    }
});

module.exports = router;