const { DataTypes } = require('sequelize');
const db = require('../db');

const Post = db.define('post', {
    // Data for whether it's private or public
    post_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    private: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    // Post title
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Picture url
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Post description
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Tag for animal type (fur baby, scale baby, exotic baby, etc.)
    tag: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // User id
    owner_id: {
        type: DataTypes.STRING,
        allowNull: false
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // comments: {
    //     type: DataTypes.JSON
    // }
});

module.exports = Post;


