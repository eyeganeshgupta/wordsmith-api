# Wordsmith Blogging API

Welcome to the Blog Web Application API! This API is built using **Node.js**, **Express.js**, and **MongoDB**. It provides a robust backend for managing blog posts, users, and comments.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create, read, update, and delete blog posts
- User authentication and authorization
- Commenting system for blog posts
- Pagination and filtering for posts
- RESTful API design

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing blog data
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js
- **JWT**: JSON Web Tokens for user authentication

## Installation

To get started with the Blog Web Application API, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/eyeganeshgupta/wordsmith-api.git
   ```

2. Navigate to the project directory:
   ```bash
   cd wordsmith-api
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```plaintext
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login an existing user

### Blog Posts

- **GET** `/api/posts` - Get all blog posts
- **GET** `/api/posts/:id` - Get a single blog post by ID
- **POST** `/api/posts` - Create a new blog post
- **PUT** `/api/posts/:id` - Update a blog post by ID
- **DELETE** `/api/posts/:id` - Delete a blog post by ID

### Comments

- **POST** `/api/posts/:id/comments` - Add a comment to a blog post
- **GET** `/api/posts/:id/comments` - Get all comments for a blog post

## Usage

After starting the server, you can use tools like **Postman** or **cURL** to interact with the API. Make sure to include the JWT token in the headers for protected routes.

### Example Request

To create a new blog post, send a `POST` request to `/api/posts` with the following JSON body:

```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post.",
  "author": "Author Name"
}
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/YourFeature`)
6. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Thank you for checking out the Wordsmith Blog API! If you have any questions or feedback, feel free to reach out.