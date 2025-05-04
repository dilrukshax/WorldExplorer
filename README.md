
<!-- Centered Core Technologies Badges -->
<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

</div>


# World Explorer App

A comprehensive web application that allows users to explore countries around the world, view detailed information about each country, and save their favorite countries. Search countries by name, region, and population.

---

- **Detailed Information**: View comprehensive details about each country including:
  - Demographics
  - Geography
  - Politics and society
  - Economy
  - Practical information
- **User Authentication**: Register, log in, and maintain your own profile.
- **Favorites System**: Save and manage your favorite countries.
- **Responsive Design**: Fully functional on both desktop and mobile devices.

![Countries App Home](https://github.com/user-attachments/assets/70d64596-738c-4a7b-a561-608e2364b8b0)

![Countries App Mobile](https://github.com/user-attachments/assets/7a67378a-0dee-4e33-a9a9-0ba448cb47cd)


---

## Table of Contents

1. [Technologies Used](#technologies-used)  
2. [Features](#features)  
3. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Backend Setup](#backend-setup)  
   - [Frontend Setup](#frontend-setup)  
4. [Usage](#usage)  
5. [API Endpoints](#api-endpoints)  
6. [Project Structure](#project-structure)  
7. [Contributing](#contributing)  
8. [License](#license)  
9. [Contact](#contact)  

---

## Technologies Used

### Frontend
- **React.js**  
- **React Router** for client-side routing  
- **Tailwind CSS** for utility-first styling  
- **Lucide React** for icons  
- **Axios** for HTTP requests  
- **Jest** for unit and integration testing  

### Backend
- **Node.js** with **Express**  
- **MongoDB** with **Mongoose** ODM  
- **JWT** for authentication  
- **bcryptjs** for password hashing  
- **cookie-session** for session management  

---

## Features

- **Country Search & Filters**  
- **Country Detail Pages** (demographics, geography, politics, economy, travel tips)  
- **User Registration & Login**  
- **Favorites System** (add/remove, view list)  
- **Profile Management**  
- **Responsive Layout** (mobile & desktop)  

---

## Getting Started

### Prerequisites

- **Node.js** v14 or higher  
- **MongoDB** running locally or via Atlas  

### Backend Setup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/countries-app.git
   cd countries-app/backend
````

2. **Install dependencies**

   ```
   npm install
   ```

3. **Create a `.env` file** in `backend/` with:

   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/countriesApp
   JWT_SECRET=your-jwt-secret-key
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the backend server**

   ```bash
   node server.js
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the frontend development server**

   ```bash
   npm start
   ```

---

## Usage

1. Open your browser to `http://localhost:3000`
2. **Register** a new account or **Log in**
3. **Search** for countries by name, region, or population
4. Click on a country card to **view details**
5. Click the **heart icon** to add/remove favorites
6. Manage your favorites from the **Profile** page

---

## API Endpoints

### Authentication

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| POST   | `/api/auth/signup`  | Register a new user |
| POST   | `/api/auth/signin`  | Log in a user       |
| POST   | `/api/auth/signout` | Log out a user      |

### User

| Method | Endpoint          | Description                          |
| ------ | ----------------- | ------------------------------------ |
| GET    | `/api/test/user`  | Access user content (protected)      |
| GET    | `/api/test/mod`   | Access moderator content (protected) |
| GET    | `/api/test/admin` | Access admin content (protected)     |

### Favorites

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| GET    | `/api/favorites`        | Get user's favorite countries |
| POST   | `/api/favorites/toggle` | Toggle a country in favorites |

---

## Project Structure

```
countries-app/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Shared UI components
│       ├── services/    # API service functions
│       └── App.js       # Main React component
└── README.md            # This file
```

---

## Contributing

1. **Fork** the repository
2. **Create** your feature branch

   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes

   ```bash
   git commit -m "Add some amazing feature"
   ```
4. **Push** to your branch

   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

---


