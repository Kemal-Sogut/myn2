const { Event, User, Rsvp } = require('../models');

// Helpers for access control
const isHostOrAdmin = (user) => user && (user.role === 1 || user.role === 2);
const isAdmin = (user) => user && user.role === 2;

exports.index = async (req, res) => {
    try {
        const events = await Event.findAll({
            order: [['date', 'ASC']],
            include: [
                { model: User, as: 'user' },
                { model: Rsvp, as: 'rsvps', where: { status: 1 }, required: false } // Include confirmed RSVPs
            ]
        });

        // We need to fetch RSVPs count separately or rely on 'rsvps' array length if we load all.
        // For small app, loading all RSVPs is fine.

        res.render('events/index', { events });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Could not load events');
        res.redirect('/');
    }
};

exports.show = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user' },
                { model: Rsvp, as: 'rsvps', include: [{ model: User, as: 'user' }] }
            ]
        });

        if (!event) {
            req.flash('error', 'Event not found');
            return res.redirect('/events');
        }

        // Check if current user has RSVPed
        let currentRsvp = null;
        if (req.session.user) {
            currentRsvp = await Rsvp.findOne({
                where: { event_id: event.id, user_id: req.session.user.id }
            });
        }

        res.render('events/show', { event, currentRsvp });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error loading event');
        res.redirect('/events');
    }
};

exports.new = (req, res) => {
    // Check auth
    if (!isHostOrAdmin(req.session.user)) {
        req.flash('error', 'You must be a host to create events');
        return res.redirect('/events');
    }
    res.render('events/new', { event: {} });
};

exports.create = async (req, res) => {
    if (!isHostOrAdmin(req.session.user)) {
        req.flash('error', 'Unauthorized');
        return res.redirect('/events');
    }

    try {
        const { title, description, date, location, capacity, rsvp_closes_before, banner_image } = req.body;

        await Event.create({
            title,
            description,
            date,
            location,
            capacity: capacity || null,
            rsvp_closes_before: rsvp_closes_before || null,
            banner_image,
            user_id: req.session.user.id
        });

        req.flash('success', 'Event created successfully');
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error creating event');
        res.render('events/new', { event: req.body, error: error.message });
    }
};

exports.edit = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            req.flash('error', 'Event not found');
            return res.redirect('/events');
        }

        if (!req.session.user || (req.session.user.id !== event.user_id && !isAdmin(req.session.user))) {
            req.flash('error', 'Unauthorized');
            return res.redirect('/events');
        }

        res.render('events/edit', { event });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error loading event');
        res.redirect('/events');
    }
};

exports.update = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            req.flash('error', 'Event not found');
            return res.redirect('/events');
        }

        if (!req.session.user || (req.session.user.id !== event.user_id && !isAdmin(req.session.user))) {
            req.flash('error', 'Unauthorized');
            return res.redirect('/events');
        }

        const { title, description, date, location, capacity, rsvp_closes_before, banner_image } = req.body;

        await event.update({
            title,
            description,
            date,
            location,
            capacity: capacity || null,
            rsvp_closes_before: rsvp_closes_before || null,
            banner_image
        });

        req.flash('success', 'Event updated successfully');
        res.redirect(`/events/${event.id}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error updating event');
        res.redirect(`/events/${req.params.id}/edit`);
    }
};

exports.destroy = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            req.flash('error', 'Event not found');
            return res.redirect('/events');
        }

        if (!req.session.user || (req.session.user.id !== event.user_id && !isAdmin(req.session.user))) {
            req.flash('error', 'Unauthorized');
            return res.redirect('/events');
        }

        await event.destroy();
        req.flash('success', 'Event cancelled');
        res.redirect('/events');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error cancelling event');
        res.redirect('/events');
    }
};
