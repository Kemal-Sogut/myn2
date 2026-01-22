const { Event, Rsvp, User, Sequelize } = require('../models');
const { Op } = Sequelize;

exports.index = async (req, res) => {
    try {
        if (!req.session.user) {
            req.flash('error', 'Please login to view dashboard');
            return res.redirect('/login');
        }

        const user = req.session.user; // Note: session user might not have latest data, query fresh if needed or just use ID.
        // Actually session user object is fine for role/id check.

        let title = "My Dashboard";
        let managedEvents = [];

        // Managed Events (Host/Admin)
        if (user.role === 2) { // Admin
            title = "Admin Dashboard";
            managedEvents = await Event.findAll({
                include: [{ model: User, as: 'user' }, { model: Rsvp, as: 'rsvps', include: ['user'] }], // Include RSVPs and users for attendee management
                order: [['date', 'DESC']]
            });
        } else if (user.role === 1) { // Host
            title = "Host Dashboard";
            managedEvents = await Event.findAll({
                where: { user_id: user.id },
                include: [{ model: Rsvp, as: 'rsvps', include: ['user'] }],
                order: [['date', 'DESC']]
            });
        }

        // Upcoming RSVPs given by current user
        const upcomingRsvps = await Rsvp.findAll({
            where: { user_id: user.id },
            include: [{
                model: Event,
                as: 'event',
                where: { date: { [Op.gte]: new Date() } }
            }],
            order: [[{ model: Event, as: 'event' }, 'date', 'ASC']]
        });

        // Past RSVPs
        const pastRsvps = await Rsvp.findAll({
            where: { user_id: user.id },
            include: [{
                model: Event,
                as: 'event',
                where: { date: { [Op.lt]: new Date() } }
            }],
            order: [[{ model: Event, as: 'event' }, 'date', 'DESC']],
            limit: 5
        });

        res.render('dashboard/index', {
            title,
            managedEvents,
            upcomingRsvps,
            pastRsvps,
            user // Pass user explicitly if needed, though res.locals.user is there.
        });

    } catch (error) {
        console.error(error);
        req.flash('error', 'Error loading dashboard');
        res.redirect('/');
    }
};
