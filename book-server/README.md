# Node.js Simple HTTP Server

This is a basic HTTP server implemented in Node.js that manages users and books. It does not use any external libraries or frameworks and handles data with a simple file-based storage system.

## Features

- **User Management**: Create users, authenticate users.
- **Book Management**: Create, delete, loan out, return, and update book entries.

## Project Structure

- `index.js`: Main server file that contains all routes and server logic.
- `data/`: Directory containing JSON files for persistent storage.
  - `users.json`: Stores user data.
  - `books.json`: Stores book data.

## API Endpoints

### Users

- **Create User**

  - **URL**: `/users`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "username": "user1",
      "password": "password123"
    }
    ```
  - **Response**: JSON object of the created user.

- **Authenticate User**
  - **URL**: `/users/authenticate`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "username": "user1",
      "password": "password123"
    }
    ```
  - **Response**: JSON object indicating success or failure of authentication.

### Books

- **Retrieve Books**

  - **URL**: `/books`
  - **Method**: `GET`
  - **Response**: JSON object of all the books.

- **Create Book**

  - **URL**: `/books`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "title": "Example Book",
      "author": "Author Name"
    }
    ```
  - **Response**: JSON object of the created book.

- **Delete Book**

  - **URL**: `/books/delete`
  - **Method**: `DELETE`
  - **Body**:
    ```json
    {
      "id": 1
    }
    ```
  - **Response**: JSON indicating success or failure of deletion.

- **Loan Out Book**

  - **URL**: `/books/loan`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "id": 1
    }
    ```
  - **Response**: JSON object of the loaned book.

- **Return Book**

  - **URL**: `/books/return`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "id": 1
    }
    ```
  - **Response**: JSON object of the returned book.

- **Update Book**
  - **URL**: `/books/update`
  - **Method**: `PUT`
  - **Body**:
    ```json
    {
      "id": 1,
      "title": "Updated Title",
      "author": "Updated Author"
    }
    ```
  - **Response**: JSON object of the updated book.

## Setup and Running

1. Ensure Node.js is installed on your system.
2. Clone the repository to your local machine.
3. Navigate to the project directory and run the server:
   ```bash
   node index.js
   ```
4. Access the server at http://localhost:8900
