# News-App

The app for the News

[Полная документация API (JSDoc)](./docs/index.html)

## Technologies used for backend

• NodeJS
• Express
• MongoDB/Mongoose (mongoDb Atlas)
• JWT
• bcrypt

## Functionality of the App

- Register and Login user
- Create, Delete, Edit, Publish News
- Delayed publish of the news

### There are also:

- CORS settings
- real-time communication with socket.io
- uploading and downloading files

### To Start the backend

1. create .env file in the root of the project
2. Specify:

- PORT=
- MONGO_URI=
- JWT_SECRET=

3. use command to start the server - node server.js
