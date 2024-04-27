import http from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';

const host = 'localhost';
const port = 8900;

const usersFile = './data/users.json';
const booksFile = './data/books.json';

const readDataFromFile = (filename) => {
  try {
    const rawText = readFileSync(filename, { encoding: 'utf8' });
    const books = JSON.parse(rawText);
    return books || [];
  } catch (error) {
    return [];
  }
};

const writeDataToFile = (filename, data) => {
  writeFileSync(filename, JSON.stringify(data, null, 2), {
    encoding: 'utf8',
  });
};

const handleUserRequest = (request, response, body) => {
  let users = readDataFromFile(usersFile);
  switch (request.url) {
    case '/users':
      if (request.method === 'GET') {
        response.end(JSON.stringify({ success: true, users }));
      } else if (request.method === 'POST') {
        const newUser = JSON.parse(body);
        newUser.id = users.length + 1;
        users.push(newUser);
        writeDataToFile(usersFile, users);
        response.end(JSON.stringify({ success: true, user: newUser }));
      } else {
        response.statusCode = 405;
        response.end(
          JSON.stringify({ success: false, error: 'Method not allowed' })
        );
      }
      break;

    case '/users/authenticate':
      if (request.method === 'POST') {
        const credentials = JSON.parse(body);
        const user = users.find(
          (u) =>
            u.username === credentials.username &&
            u.password === credentials.password
        );
        const result = user
          ? { success: true, userId: user.id }
          : { success: false, message: 'Invalid credentials' };
        response.end(JSON.stringify(result));
      } else {
        response.statusCode = 405;
        response.end(
          JSON.stringify({ success: false, error: 'Method not allowed' })
        );
      }
      break;

    default:
      response.statusCode = 404;
      response.end(
        JSON.stringify({ success: false, error: 'User endpoint not found' })
      );
  }
};

const handleBookRequest = (request, response, body) => {
  const books = readDataFromFile(booksFile);
  switch (request.url) {
    case '/books/create':
      if (request.method === 'POST') {
        const newBook = JSON.parse(body);
        newBook.id = books.length + 1;
        newBook.status = 'available';
        books.push(newBook);
        writeDataToFile(booksFile, books);
        response.end(
          JSON.stringify({
            success: true,
            message: 'Book created successfully',
            book: newBook,
          })
        );
      } else {
        response.statusCode = 405;
        response.end(JSON.stringify({ error: 'Method not allowed' }));
      }
      break;

    case '/books/delete':
      if (request.method === 'DELETE') {
        const { id } = JSON.parse(body);
        const initialLength = books.length;
        books = books.filter((book) => book.id !== id);
        if (books.length < initialLength) {
          writeDataToFile(booksFile, books);
          response.end(JSON.stringify({ success: true }));
        } else {
          response.end(
            JSON.stringify({ success: false, message: 'Book not found' })
          );
        }
      } else {
        response.statusCode = 405;
        response.end(
          JSON.stringify({ success: false, error: 'Method not allowed' })
        );
      }
      break;

    case '/books/loan':
      if (request.method === 'POST' || request.method === 'PUT') {
        const { id } = JSON.parse(body);
        const book = books.find((book) => book.id === id);
        if (book && book.status === 'available') {
          book.status = 'loaned';
          writeDataToFile(booksFile, books);
          response.end(
            JSON.stringify({
              success: true,
              message: 'Book loaned out successfully',
              book,
            })
          );
        } else {
          response.end(
            JSON.stringify({ success: false, message: 'Book not available' })
          );
        }
      } else {
        response.statusCode = 405;
        response.end(
          JSON.stringify({ success: false, error: 'Method not allowed' })
        );
      }
      break;

    case '/books/return':
      if (request.method === 'POST') {
        const { id } = JSON.parse(body);
        const book = books.find((book) => book.id === id);
        if (book && book.status === 'loaned') {
          book.status = 'available';
          writeDataToFile(booksFile, books);
          response.end(
            JSON.stringify({
              success: true,
              message: 'Book returned successfully',
              book,
            })
          );
        } else {
          response.end(
            JSON.stringify({ success: false, message: 'Book not loaned' })
          );
        }
      } else {
        response.statusCode = 405;
        response.end(
          JSON.stringify({ success: false, error: 'Method not allowed' })
        );
      }
      break;

    case '/books/update':
      if (request.method === 'PUT') {
        const { id, title, author } = JSON.parse(body);
        const book = books.find((book) => book.id === id);
        if (book) {
          book.title = title || book.title;
          book.author = author || book.author;
          writeDataToFile(booksFile, books);
          response.end(JSON.stringify({ success: true, book }));
        } else {
          response.end(
            JSON.stringify({ success: false, message: 'Book not found' })
          );
        }
      } else {
        response.statusCode = 405;
        response.end(
          JSON.stringify({ success: false, error: 'Method not allowed' })
        );
      }
      break;

    default:
      response.statusCode = 404;
      response.end(
        JSON.stringify({ success: false, error: 'Book endpoint not found' })
      );
  }
};

const requestHandler = (request, response) => {
  response.setHeader('Content-Type', 'application/json');

  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });

  request.on('end', () => {
    if (request.url.startsWith('/users')) {
      handleUserRequest(request, response, body);
    } else if (request.url.startsWith('/books')) {
      handleBookRequest(request, response, body);
    } else {
      response.statusCode = 404;
      response.end(
        JSON.stringify({
          success: false,
          error: 'Endpoint not found',
        })
      );
    }
  });
};

const server = http.createServer(requestHandler);

server.listen(port, host, () => {
  console.log(`Server is listening on http://${host}:${port}`);
});
