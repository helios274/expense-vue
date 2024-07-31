# ExpenseVue

**ExpenseVue** is a dynamic and feature-rich expense-tracking full-stack web application that demonstrates the synergy of modern web development technologies.

## Features

- Responsive design
- User Authentication
- Real-time updates

## Tech Stack

**Client:** React, Redux, React Hook Form, TailwindCSS

**Backend:** Django Rest Framework

## Run Locally

### 1. Backend server

To run the backend server, add .env file in the 'backend' folder and then add the following environment variables

| Variables                                                       | Description                                                                                                                                                                  |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DEBUG=True` (development), `DEBUG=False` (production)          | Indicates whether the application is running in debug mode. Should be `True` during development and `False` in production.                                                   |
| `SECRET_KEY=your-secret-key`                                    | A secret key used for cryptographic signing. Keep it confidential and unique for each Django project.                                                                        |
| `ALLOWED_HOSTS=localhost,127.0.0.1,.example.com`                | A list of strings representing the host/domain names that the Django site can serve.                                                                                         |
| `DB_URL=postgres://user:password@localhost:5432/mydatabase`     | The database URL containing connection information, including type, user, password, host, port, and database name.                                                           |
| `CORS_ALLOWED_ORIGINS=http://localhost:3000,http://example.com` | A list of origins authorized to make cross-origin requests. Essential for enabling CORS when front-end and back-end are on different domains. Not require if `DEBUG` is True |
