module.exports = (sequelize, DataTypes) => {
    const Rsvp = sequelize.define('Rsvp', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'compositeIndex' // Part of composite unique key
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'compositeIndex' // Part of composite unique key
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0 // pending: 0, confirmed: 1, declined: 2
        }
    }, {
        tableName: 'rsvps',
        underscored: true
    });

    Rsvp.associate = function (models) {
        Rsvp.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Rsvp.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
    };

    return Rsvp;
};
