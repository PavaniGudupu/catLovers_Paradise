🚀 "CatLovers Paradise" - A Fun-Filled Platform for Cat Lovers!** 🐱💫


**CatLovers Paradise** is a fun and engaging web platform for cat lovers to explore random cat images, learn more about cats, and join a community of feline enthusiasts. The platform allows users to sign up, log in, and view a new random cat image every time they visit the page.

![Screenshot 2024-12-22 230829](https://github.com/user-attachments/assets/bef45e09-6ded-4197-8644-ecae1022f397)


## Features:
- **Random Cat Images**: Fetches random cat images from the Cat API.
- **User Authentication**: Users can register and log in using email or Google OAuth.
- **Responsive UI**: Optimized for both desktop and mobile devices.
- **User-friendly Interface**: Easy to navigate and explore the platform.

## Tech Stack:
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Passport.js (Local & Google OAuth)
- **API**: Cat API (random cat image generator)
- **Frontend**: HTML, CSS, EJS (Embedded JavaScript Templates)

## Installation:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/catlovers-paradise.git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables:
   - Create a `.env` file in the root of the project and add the following:
   ```
   PG_USER=your-database-user
   PG_HOST=localhost
   PG_DATABASE=your-database-name
   PG_PASSWORD=your-database-password
   PG_PORT=5432
   CLIENT_ID=your-google-client-id
   CLIENT_SECRET=your-google-client-secret
   TOPSECRET=your-secret-session-key
   API_URL=https://api.thecatapi.com/v1/images/search
   ```

4. Start the server:
   ```
   npm start
   ```

5. Visit `http://localhost:3000/` in your browser.



## Landing Page:

![Screenshot 2024-12-22 230633](https://github.com/user-attachments/assets/f00b2992-765b-49e6-a8a1-3082bdae3743)

## Register Page:

![Screenshot 2024-12-22 230705](https://github.com/user-attachments/assets/5c7a4850-1442-42bf-a3f1-444637ee6b00)

## Login Page:

![Screenshot 2024-12-22 230731](https://github.com/user-attachments/assets/908ab282-e11a-4002-a10e-d348579cb2c4)

## Home Page:

![Screenshot 2024-12-22 230829](https://github.com/user-attachments/assets/bef45e09-6ded-4197-8644-ecae1022f397)
