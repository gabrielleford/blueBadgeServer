const { DataTypes } = require('sequelize');
const db = require('../db');

const User = db.define('user', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    passwordhash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    profileDescription: {
        type: DataTypes.TEXT,
        allowNUll: true
    },
    profilePicture: {
        type: DataTypes.JSON,
        allowNull: true
    }
});

module.exports = User;