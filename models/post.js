const { DataTypes } = require('sequelize');
const db = require('../db');

const Post = db.define('post', {
    // Post title
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Picture url
    url: {
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
    owner: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // hearts: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    // comments: {
    //     type: DataTypes.JSON
    // }
});

module.exports = Post;


