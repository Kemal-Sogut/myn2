const { User } = require('../models');

exports.getLogin = (req, res) => {
    res.render('auth/login', { error: req.flash('error') });
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.authenticate(password))) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        req.session.user = user;
        req.flash('success', 'Logged in successfully');
        res.redirect('/'); // Or dashboard
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred during login');
        res.redirect('/login');
    }
};

exports.getSignup = (req, res) => {
    res.render('auth/signup', { error: req.flash('error') });
};

exports.postSignup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            req.flash('error', 'All fields are required');
            return res.redirect('/signup');
        }

        const user = await User.create({
            username,
            email,
            password,
            role: parseInt(role) || 0
        });

        req.session.user = user; // Auto login
        req.flash('success', 'Account created successfully');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            req.flash('error', 'Username or Email already exists');
        } else {
            req.flash('error', 'Error creating account');
        }
        res.redirect('/signup');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
