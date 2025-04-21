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

### To Start the backend locally

1. create mongodb account https://www.mongodb.com/
2. create .env file in the root of the project
3. Specify:

- PORT=
- MONGO_URI=
- JWT_SECRET=

4. use command npm install
5. use command to start the server - node server.js

### The project is deployed with https://railway.app/

Can check the functionality of the app using Postman or Insomnia

The main endpoints to shoot:

- Create user https://news-app-production-73ae.up.railway.app/api/auth/register
- Login user https://news-app-production-73ae.up.railway.app/api/auth/login
- Create News https://news-app-production-73ae.up.railway.app/api/news
- Edit News https://news-app-production-73ae.up.railway.app/api/news/id
- Delete News https://news-app-production-73ae.up.railway.app/api/news/id
- Get All News https://news-app-production-73ae.up.railway.app/api/news
- Immediate Publish New https://news-app-production-73ae.up.railway.app/api/news/id/publish
