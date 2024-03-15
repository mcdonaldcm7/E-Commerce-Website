# E-Commerce Website Project Documentation

## Table of Contents

1. Introduction
2. Project Overview
3. Features
4. Technologies Used
5. Getting Started
6. Installation
7. Configuration
8. Usage
9. API Documentation Reference
10. Testing

---
## 1. Introduction
Welcome to the documentation for our E-Commerce website project. This document provides an overview
of the project, its features, installation instructions, usage guidelines, and other relevant information.

## 2. Project Overview
Our E-Commerce website aims to provide a platform for users to browse, purchase, and manage products online.
The website will include features such as user authentication, product listings, shopping cart functionality, order processing, and payment integration.

## 3. Features
- User authentication (register, login, logout, password reset)
- Product management (add, edit, delete products)
- Shopping cart functionality (add, update, remove items)
- Order processing (checkout, view order history)
- Payment integration (Stripe for credit card payments)

## 4. Technologies Used
- Backend: Node.js, Express.js
- Database: MondoDB
- Authentication: Passport.js
- Payment Processing: Stripe
- Frontend (not included in this project): HTML, CSS, React.js

## 5. Getting Started
To get started with the project, follow the installation and configuration instructions provided below.

## 6. Installation
1. Clone the project repository from GitHub
2. install dependencies using **`npm install`**.
3. Configure environment variables (e.g., MongoDB connection string, Stripe API key).
4. Start the server using **`npm start`**.

## 7. Configuration
- Configure MongoDB connection string in **`.env** file.
- Configure Stripe API key in **`.env`** file.
- Update other configuration options as needed in `.env` file.

## 8. Usage
- Register a new user account or login with existing credentials.
- Browse products, add items to the shopping cart, and proceed to checkout.
- Complete the payment process using the integrated Stripe payment gateway
- View order history and manage user profile

## 9 API Documentation Reference
- [API documenation](./API%20Documentation.md)

10. Testing
- Unit tests: Run `npm test` to execute unit testing using Mocha.
