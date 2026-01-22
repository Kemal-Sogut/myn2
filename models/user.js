const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_digest: { // Using password_digest to match Rails schema usually, but here we can just map it. 
            // Actually Rails uses password_digest column. We can use the same.
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.INTEGER,
            defaultValue: 0 // guest: 0, host: 1, admin: 2
        }
    }, {
        tableName: 'users',
        underscored: true, // Use snake_case columns (created_at, updated_at) to match Rails
    });

    User.associate = function (models) {
        User.hasMany(models.Event, { foreignKey: 'user_id', as: 'events' });
        User.hasMany(models.Rsvp, { foreignKey: 'user_id', as: 'rsvps' });
    };

    // Helper method to validate password
    User.prototype.authenticate = async function (password) {
        return await bcrypt.compare(password, this.password_digest);
    };

    // Hooks to hash password
    User.beforeCreate(async (user) => {
        if (user.password) { // We will pass virtual 'password' field when creating
            const salt = await bcrypt.genSalt(10);
            user.password_digest = await bcrypt.hash(user.password, salt);
        }
    });

    User.beforeUpdate(async (user) => {
        if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password_digest = await bcrypt.hash(user.password, salt);
        }
    });

    return User;
};
