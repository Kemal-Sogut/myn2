const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
// const rsvpController = require('../controllers/rsvpController'); // TODO

// Middleware to check login
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
};

router.get('/', eventController.index);
router.get('/new', requireLogin, eventController.new);
router.post('/', requireLogin, eventController.create);
router.get('/:id', eventController.show);
router.get('/:id/edit', requireLogin, eventController.edit);
router.put('/:id', requireLogin, eventController.update);
const rsvpController = require('../controllers/rsvpController');

router.post('/:eventId/rsvp', requireLogin, rsvpController.create);
router.delete('/:eventId/rsvp', requireLogin, rsvpController.destroy);
router.delete('/:eventId/rsvps/:rsvpId', requireLogin, rsvpController.destroyAttendee);

module.exports = router;
