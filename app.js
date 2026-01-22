require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(flash());

// Global variables for views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    res.locals.currentPath = req.path;
    next();
});

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth'); // Will create next
// const eventRoutes = require('./routes/events');

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/events', require('./routes/events'));

// Health check route (for debugging)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        env: process.env.NODE_ENV,
        dbHost: process.env.DB_HOST || 'not set',
        dbName: process.env.DB_NAME || 'not set'
    });
});

// Start server FIRST, then connect to database
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('DB Host:', process.env.DB_HOST);
    console.log('DB Name:', process.env.DB_NAME);

    // Now sync database
    sequelize.sync({ alter: true })
        .then(() => {
            console.log('Database connected and synced!');
        })
        .catch(err => {
            console.error('Database connection error:', err.message);
            console.error('Full error:', err);
        });
});
