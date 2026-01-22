const { Rsvp, Event, User } = require('../models');

// RSVP to an event
exports.create = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { status } = req.body;
        const userId = req.session.user.id;

        const event = await Event.findByPk(eventId);
        if (!event) {
            req.flash('error', 'Event not found');
            return res.redirect('/events');
        }

        // Check conditions
        if (await event.isRsvpOpen() === false) {
            req.flash('error', 'RSVPs are closed for this event');
            return res.redirect(`/events/${eventId}`);
        }

        if (event.capacity) {
            const count = await Rsvp.count({ where: { event_id: eventId, status: 1 } });
            if (count >= event.capacity) {
                req.flash('error', 'Event is full');
                return res.redirect(`/events/${eventId}`);
            }
        }

        // Create or Update
        const [rsvp, created] = await Rsvp.findOrCreate({
            where: { event_id: eventId, user_id: userId },
            defaults: { status: status || 1 }
        });

        if (!created) {
            rsvp.status = status || 1;
            await rsvp.save();
        }

        req.flash('success', 'RSVP confirmed!');
        res.redirect(`/events/${eventId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error processing RSVP');
        res.redirect(`/events/${req.params.eventId}`);
    }
};

// Cancel own RSVP
exports.destroy = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.session.user.id;

        const rsvp = await Rsvp.findOne({
            where: { event_id: eventId, user_id: userId }
        });

        if (rsvp) {
            await rsvp.destroy();
            req.flash('success', 'RSVP cancelled');
        }

        res.redirect(`/events/${eventId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error cancelling RSVP');
        res.redirect(`/events/${req.params.eventId}`);
    }
};

// Host removing an attendee via DELETE /events/:id/rsvps/:rsvp_id
exports.destroyAttendee = async (req, res) => {
    try {
        const { eventId, rsvpId } = req.params;
        const event = await Event.findByPk(eventId);

        if (!event) {
            req.flash('error', 'Event not found');
            return res.redirect('/events');
        }

        // Host/Admin check
        if (!req.session.user || (req.session.user.id !== event.user_id && req.session.user.role !== 2)) {
            req.flash('error', 'Unauthorized');
            return res.redirect(`/events/${eventId}`);
        }

        const rsvp = await Rsvp.findByPk(rsvpId);
        if (rsvp) {
            await rsvp.destroy();
            req.flash('success', 'Attendee removed');
        }

        res.redirect(`/events/${eventId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error removing attendee');
        res.redirect(`/events/${req.params.eventId}`);
    }
}
