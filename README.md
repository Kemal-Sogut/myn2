# myn2 (Meet Your Neighbour v2)

A Node.js rebuild of the Meet Your Neighbour community event management application. This version replaces the Ruby on Rails stack with a lightweight Node.js/Express architecture, using SQLite as a local database and EJS for server-rendered views.

---

## Overview

myn2 is a community-focused web application that allows neighbours to create, browse, and manage local events. It follows a conventional MVC structure with clearly separated concerns across controllers, models, routes, and views.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Templating | EJS |
| Database | SQLite |
| Styling | HTML / CSS |

---

## Project Structure

```
myn2/
├── config/              # App configuration (database setup, etc.)
├── controllers/         # Request handling logic
├── models/              # Database models and queries
├── routes/              # Express route definitions
├── views/               # EJS templates
├── public/              # Static assets (CSS, images)
├── scripts/             # Utility and seed scripts
├── app.js               # Application entry point
├── database.sqlite      # SQLite database file
├── .env                 # Environment variables
└── package.json
```

---

## Features

- Browse and view community events
- Create and manage local events
- User-facing server-rendered pages via EJS
- Lightweight SQLite database — no external DB setup required
- Environment-based configuration via `.env`

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kemal-Sogut/myn2.git
   cd myn2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   A `.env` file is included in the repository. Update any values as needed:
   ```env
   PORT=3000
   SESSION_SECRET=your_secret_here
   ```

4. **Start the application**
   ```bash
   node app.js
   ```

   The app will be available at `http://localhost:3000`.

---

## Related Projects

This is a rewrite of [meet_your_neighbour](https://github.com/Kemal-Sogut/meet_your_neighbour), which was originally built with Ruby on Rails. myn2 trades the Rails stack for a leaner Node.js/Express setup.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

*Built by [Kemal Sogut](https://github.com/Kemal-Sogut)*
