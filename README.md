# ExpenseVue

**ExpenseVue** is a dynamic and feature-rich expense-tracking full-stack web application that demonstrates the synergy of modern web development technologies.

## Features

- Responsive design
- User Authentication
- Real-time updates

## Tech Stack

**Client:** React, Redux, React Hook Form, TailwindCSS

**Backend:** Django Rest Framework

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`: development or production

`PORT`: Port number(optional). Default value is 3000

`JWT_SECRET`: A secret string for JWT

`JWT_EXPIRES_IN`: JWT lifetime. For example, '1d' is 1 day, '2w' is 2 weeks, '4h' is 4 hours, and so on.

`DATABASE_URL`: Databse URL

`PRODUCTION_URL`: Apps production url. Required in production environment.

## Run Locally

### 1. Backend server

To run the backend server, add .env file in the 'backend' folder and then add the following environment variables

| Variable               | Description                                                                                                                                   | Example                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `DEBUG`                | Indicates whether the application is running in debug mode. Should be `True` during development and `False` in production.                    | `DEBUG=True` (development), `DEBUG=False` (production)          |
| `SECRET_KEY`           | A secret key used for cryptographic signing. Keep it confidential and unique for each Django project.                                         | `SECRET_KEY=your-secret-key`                                    |
| `ALLOWED_HOSTS`        | A list of strings representing the host/domain names that the Django site can serve.                                                          | `ALLOWED_HOSTS=localhost,127.0.0.1,.example.com`                |
| `DB_URL`               | The database URL containing connection information, including type, user, password, host, port, and database name.                            | `DB_URL=postgres://user:password@localhost:5432/mydatabase`     |
| `CORS_ALLOWED_ORIGINS` | A list of origins authorized to make cross-origin requests. Essential for enabling CORS when front-end and back-end are on different domains. | `CORS_ALLOWED_ORIGINS=http://localhost:3000,http://example.com` |
