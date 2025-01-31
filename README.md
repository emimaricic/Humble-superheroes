# Humble Superhero API

A full-stack application that celebrates everyday superheroes by tracking their powers and humility scores. This implementation includes user authentication with refresh tokens and a complete superhero management system.

## Features

### Authentication
- Email-based signup and login system
- Secure refresh token implementation
- Protected routes for authenticated users

### Superhero Management
- Create and manage superhero profiles
- Track superhero powers and humility scores
- Sorted display based on humility rankings

### Technical Stack

#### Backend
- Node.js with NestJS framework
- In-memory data storage
- JWT for authentication
- Input validation and error handling

#### Frontend
- React for the user interface
- Real-time updates for superhero listings
- Responsive design for various screen sizes
- Protected routes with authentication guards

## API Endpoints

### Authentication
```
POST /auth/signup - Register a new user
POST /auth/login - User login
POST /auth/refresh - Refresh access token
POST /auth/logout - User logout
```

### Superhero Management
```
POST /superheroes - Add a new superhero
GET /superheroes - Retrieve sorted superhero list
```

## Getting Started

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

3. Start the development servers
```bash
# Backend
npm run start:dev

# Frontend
npm run dev
```

## Future Improvements

If I had more time, I would:

- Implement a persistent database solution (e.g., PostgreSQL)
- Add user roles and permissions
- Create superhero teams/groups feature
- Add profile images for superheroes
- Add more comprehensive test coverage
- Create a mobile app version

## Team Collaboration Notes

This project was built with team collaboration in mind:

- Code is structured in modules for easy division of work
- Clear naming conventions and documentation
- Room for feature expansion
- Easy to add new API endpoints
- Frontend components are reusable

## Testing

Basic test coverage is included for core functionality:
- Authentication flow tests
- Superhero creation validation
- API endpoint testing

## Security Considerations

- JWT-based authentication
- Input validation
- Protected routes
- Refresh token rotation
- XSS protection
- CORS configuration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Acknowledgments

- Built as part of the technical assessment for eJam
- Inspired by the idea that everyone can be a superhero in their own way
