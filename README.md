[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)


# Countries App

A comprehensive web application that allows users to explore countries around the world, view detailed information about each country, and save their favorite countries. search countries by name, region, and population

![Image](https://github.com/user-attachments/assets/70d64596-738c-4a7b-a561-608e2364b8b0)

- **Detailed Information**: View comprehensive details about each country including:
  - Demographics
  - Geography
  - Politics and society
  - Economy
  - Practical information
- **User Authentication**: Register, login, and maintain your own profile
- **Favorites System**: Save and manage your favorite countries
- **Responsive Design**: Fully functional on both desktop and mobile devices

![Image](https://github.com/user-attachments/assets/7a67378a-0dee-4e33-a9a9-0ba448cb47cd)

## Technologies Used

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API requests
- Jest for testing

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Cookie-session for session management

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-username/countries-app.git
cd countries-app

# Install backend dependencies
cd backend
npm install

# Create a .env file with the following variables
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/countriesApp
JWT_SECRET=your-jwt-secret-key
CLIENT_URL=http://localhost:3000

# Start the backend server
node server.js
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install frontend dependencies
npm install

# Start the frontend development server
npm start
```

## Usage

After starting both the backend and frontend servers, you can access the application at `http://localhost:3000`.

1. **Register** a new account or **login** with existing credentials
2. **Explore** countries using the search bar or region filter
3. **View** detailed information about a country by clicking on its card
4. **Add** countries to your favorites list by clicking the heart icon
5. **Manage** your favorite countries from your profile page

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login a user
- `POST /api/auth/signout` - Logout a user

### User
- `GET /api/test/user` - Access user content (protected)
- `GET /api/test/mod` - Access moderator content (protected)
- `GET /api/test/admin` - Access admin content (protected)

### Favorites
- `GET /api/favorites` - Get user's favorite countries
- `POST /api/favorites/toggle` - Toggle a country in user's favorites

## Project Structure

```
countries-app/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Custom middleware functions
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   └── server.js        # Server entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── services/    # API service functions
│       └── App.js       # Main application component
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
