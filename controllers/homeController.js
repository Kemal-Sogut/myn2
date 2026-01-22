const { Event, User, Rsvp, Sequelize } = require('../models');
const { Op } = Sequelize;

exports.index = async (req, res) => {
    try {
        const upcomingEvents = await Event.findAll({
            where: { date: { [Op.gt]: new Date() } },
            limit: 3,
            order: [['date', 'ASC']],
            include: [
                { model: User, as: 'user' },
                { model: Rsvp, as: 'rsvps' }
            ]
        });

        // Convert Sequelize instances to JSON or pass directly. 
        // EJS can handle Sequelize instances, but cleaner to have plain objects if complex.
        // For methods like 'banner_path', we need the instance.

        res.render('home/index', { upcoming_events: upcomingEvents });
    } catch (error) {
        console.error(error);
        res.render('home/index', { upcoming_events: [] });
    }
};
