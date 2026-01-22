module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.TEXT,
        date: {
            type: DataTypes.DATE, // DateTime
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1
            }
        },
        rsvp_closes_before: DataTypes.INTEGER,
        banner_image: DataTypes.STRING,
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'events',
        underscored: true
    });

    Event.associate = function (models) {
        Event.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Event.hasMany(models.Rsvp, { foreignKey: 'event_id', as: 'rsvps' });
    };

    // Constants
    Event.BANNER_OPTIONS = ['banner-1.jpg', 'banner-2.jpg', 'banner-3.jpg'];

    // Instance Methods
    Event.prototype.getBannerPath = function () {
        return this.banner_image || Event.BANNER_OPTIONS[0];
    };

    Event.prototype.isRsvpOpen = function () {
        if (this.rsvp_closes_before == null) return true;
        if (!this.date) return false;

        const closeTime = new Date(this.date.getTime() - (this.rsvp_closes_before * 60 * 60 * 1000));
        return new Date() < closeTime;
    };

    return Event;
};
