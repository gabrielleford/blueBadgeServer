const router = require('express').Router();
const { Post, User } = require('../models/index');
const validateJWT = require('../middleware/validatejwt');
const { route } = require('./usercontroller');
const sequelize = require("sequelize");

// * Create post *
// http://localhost:3000/post/create
// {"post": {"private": "false", "title": "fur baby", "image": "some img url", "description": "description of fur baby", "tag": "fur baby"}}
router.post('/create', validateJWT, async (req, res) => {
    const { private, title, image, description, tag } = req.body.post;
    const id = req.user_id;
    const username = req.username;
    console.log(`Owner ID: ${id}`);

    const post = {
        private,
        title,
        image,
        description,
        tag,
        owner_id: id,
        username: username,
        likes: 0
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

// * Get all posts when logged in *
// http://localhost:3000/post/posts
router.get('/posts', async (req, res) => {
    const id = req.user_id;

    try {
        const allPosts = await Post.findAll();

        res.status(200).json(allPosts);
    } catch (err) {
        res.status(500).json({
            error: `Error: ${err}`
        });
    }
});

// * Get other users' public posts
// http://localhost:3000/post/posts/:username
router.get('/posts/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const userPosts = await Post.findAll({
            where: {
                private: false,
                username: username
            }
        });

        res.status(200).json(userPosts);
    } catch (err) {
        res.status(500).json({
            error: `Error: ${err}`
        });
    }
});

// * Get all of another user's posts *
// http://localhost:3000/post/posts/all/:username
router.get('/posts/all/:username', validateJWT, async (req, res) => {
    const username = req.params.username;

    try {
        const userPosts = await Post.findAll({
            where: {
                username: username
            }
        })

        res.status(200).json(userPosts);
    } catch (err) {
        res.status(500).json({
            err: `Error: ${err}`
        })
    }
})

// * Get post by id *
//http://localhost:3000/post/:id
router.get('/:id', async (req, res) => {
    const postId = req.params.id;

    try {
        const postById = await Post.findAll({
            where: {
                private: false,
                post_id: postId,
            }
        });

        res.status(200).json(postById);
    } catch (err) {
        res.status(500).json({ error: `Error: ${err}` });
    }
});

// * Get public & private post by id *
// http://localhost:3000/post/validated/:id
router.get('/validated/:id', validateJWT, async (req, res) => {
    const postId = req.params.id;

    try {
        const postById = await Post.findAll({
            where: {
                post_id: postId,
            }
        });

        res.status(200).json(postById);
    } catch (err) {
        res.status(500).json({ error: `Error: ${err}` });
    }
});

// * Get posts by tag *
//http://localhost:3000/post/tag/:tag
router.get('/tag/:tag', async (req, res) => {
    const tag = req.params.tag;

    try {
        const postsByTag = await Post.findAll({
            where: {
                private: false,
                tag: tag
            }
        });

        res.status(200).json(postsByTag);
    } catch (err) {
        res.status(500).json({
            err: `Error: ${err}`
        });
    }
});

// * Get public & private posts by tag *
// http://localhost:3000/post/tag/all/:tag
router.get('/tag/all/:tag', validateJWT, async (req, res) => {
    const tag = req.params.tag;

    try {
        const postsByTag = await Post.findAll({
            where: {
                tag: tag
            }
        });

        res.status(200).json(postsByTag);
    } catch (err) {
        res.status(500).json({
            err: `Error: ${err}`
        });
    }
})

// * Update post *
// http://localhost:3000/edit/:id
// {"post": {"private": "false", "title": "fur baby", "image": "some img url", "description": "updated description", "tag": "fur baby"}}
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
            post_id: postId
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
            post_id: postId,
        }
    });

    if (JSON.parse(JSON.stringify(postOwner))[0].owner_id === id) {
        const query = {
            where: {
                post_id: postId,
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

// * add/remove like from post and user
router.put('/like/:postid', validateJWT, async (request, result) => {
    const postID = request.params.postid;
    const userID = request.user_id;

    const userInfo = await User.findAll({
        where: {
            user_id: userID
        }
    });

    try {
        if (JSON.parse(JSON.stringify(userInfo))[0].likedPosts.includes(postID)) {
            Post.increment('likes', { by: -1, where: { post_id: postID } })
            User.update(
                { 'likedPosts': sequelize.fn('array_remove', sequelize.col('likedPosts'), postID) },
                { 'where': { 'user_id': userID } }
            );
            result.status(200).json({ message: 'Like removed' })
        }
        else {
            Post.increment('likes', { by: 1, where: { post_id: postID } })
            User.update(
                { 'likedPosts': sequelize.fn('array_append', sequelize.col('likedPosts'), postID) },
                { 'where': { 'user_id': userID } }
            );
            result.status(200).json({ message: 'Like added' })
        }
    } catch (error) {
        result.status(500).json({
            err: `Error ${error}`
        });
    }
})

module.exports = router;