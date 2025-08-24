# Staycation Backend API

A robust GraphQL API backend for the Staycation vacation accommodation reservation platform. Built with Node.js, Apollo Server, and MongoDB, featuring JWT authentication, Google OAuth integration, and comprehensive booking management.

## 🚀 Features

- **GraphQL API** - Efficient data fetching with Apollo Server 4
- **Authentication & Authorization** - JWT tokens + Google OAuth 2.0
- **User Management** - Registration, login, admin controls
- **Hotel Management** - CRUD operations for accommodations
- **Booking System** - Complete reservation management
- **Story Management** - User testimonials and reviews
- **File Upload Support** - Image handling with Cloudinary integration
- **Role-based Access Control** - Admin and user permissions
- **Database Integration** - MongoDB with Mongoose ODM

## 🛠️ Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime environment
- **Apollo Server 4** - GraphQL server implementation
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **Passport.js** - Authentication middleware
- **Google OAuth 2.0** - Third-party authentication
- **CryptoJS** - Password encryption
- **CORS** - Cross-origin resource sharing

### Additional Services
- **Cloudinary** - Image upload and management
- **Express Session** - Session management
- **dotenv** - Environment variable management

## 📁 Project Structure

```
├── config/
│   ├── db.js              # MongoDB connection configuration
│   ├── passport.js        # Passport Google OAuth setup
│   ├── resolvers.js       # GraphQL resolvers
│   └── typeDefs.js        # GraphQL schema definitions
├── models/
│   ├── User.js           # User data model
│   ├── Hotel.js          # Hotel data model
│   ├── Booking.js        # Booking data model
│   └── Stories.js        # Stories data model
├── routes/
│   └── auth.js           # OAuth authentication routes
├── middleware/
│   └── verifyToken.js    # JWT verification middleware
├── index.js              # Main server entry point
└── package.json          # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Google OAuth credentials
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd staycation-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
    MONGO_URI=mongodb+srv://juwon:juwon@cluster0.5qfit.mongodb.net/staycation?retryWrites=true&w=majority&appName=Cluster0

   # JWT Security
    PASS_WORD = "juwon"
    JWT_PASSWORD = "staycation"

   # Google OAuth
    GOOGLE_CLIENT_ID = "1061887172885-lgpj9g5rc63t0uto4ghnv832lip4a500.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET = "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"
    
   # Session
    SESSION_SECRET="staycation"

   # Frontend URL
    CLIENT_URL=http://localhost:3000
   
   # Environment
    NODE_ENV=development
    PORT = 4000
    CLOUD_NAME = 'clothing-wave'
    CLOUD_KEY = '399166194617254'
    CLOUD_KEY_SECRET = 'KMTnF72qn2ACothZ97lCO_Xh7Lk'
   ```

4. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

   Server will be available at `http://localhost:4000`

## 📜 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (auto-restart)

## 🔧 API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:4000/`
- **Method**: POST
- **Content-Type**: `application/json`

### OAuth Routes
- **Google Login**: `GET /auth/google`
- **Google Callback**: `GET /auth/google/callback`

## 📊 GraphQL Schema

### Queries

```graphql
type Query {
  # Hotel queries
  hotels: [Hotel!]!
  getHotel(id: ID!): Hotel!
  
  # Booking queries
  bookings: [Booking!]!
  getBooking(id: ID!): Booking!
  getUserBookings(userId: ID!): [Booking!]!
  
  # User queries
  getUsers: [User!]!
  getUser(id: ID!): User!
  getAuthStatus: AuthResponse!
  
  # Story queries
  stories: [Story!]!
  getStory(id: ID!): Story!
}
```

### Mutations

```graphql
type Mutation {
  # Authentication
  register(input: RegisterInput!): User!
  login(input: LoginInput!): User!
  googleAuth(tokenId: String!): AuthResponse!
  setUserAdmin(userId: ID!, isAdmin: Boolean!): User!
  
  # Hotel management
  addHotel(name: String!, location: String!, price: String!, ...): Hotel!
  updateHotel(id: ID!, name: String, location: String, ...): Hotel!
  deleteHotel(id: ID!): String!
  
  # Booking management
  addBooking(name: String!, email: String!, phone: String!, ...): Booking!
  updateBooking(id: ID!, name: String, email: String, ...): Booking!
  deleteBooking(id: ID!): String!
  
  # User management
  updateUser(id: ID!, email: String, password: String): User!
  deleteUser(id: ID!): String!
  
  # Story management
  addStory(name: String!, title: String!, body: String!): Story!
  updateStory(id: ID!, name: String, title: String, body: String): Story!
  deleteStory(id: ID!): String!
}
```

## 🔐 Authentication

### JWT Authentication
The API uses JWT tokens for authentication. Include the token in request headers:

```javascript
headers: {
  'Authorization': 'Bearer your_jwt_token_here'
}
```

### Google OAuth Flow
1. Redirect user to `/auth/google`
2. Google handles authentication
3. User redirected to `/auth/google/callback`
4. JWT token generated and returned

### Registration Example
```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    _id
    email
    firstName
    lastName
    isAdmin
    accessToken
  }
}
```

### Login Example
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    _id
    email
    firstName
    lastName
    isAdmin
    accessToken
  }
}
```

## 🗄️ Database Models

### User Model
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (encrypted),
  firstName: String,
  lastName: String,
  isAdmin: Boolean (default: false),
  googleId: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Hotel Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  location: String (required),
  price: String (required),
  description: String,
  features: [String],
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String (required),
  userId: String,
  booking: {
    hotel: Hotel Object,
    nights: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Authorization Middleware

The API includes three levels of authorization:

1. **verifyToken** - Basic JWT validation
2. **verifyTokenAndAuth** - User can access own resources or admin access
3. **verifyTokenAndAdmin** - Admin-only access

## 🌐 CORS Configuration

CORS is configured to allow requests from:
- Development: `http://localhost:3000`
- Production: Set via `CLIENT_URL` environment variable

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | ✅ |
| `JWT_PASSWORD` | JWT secret key | ✅ |
| `PASS_WORD` | Password encryption key | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ |
| `SESSION_SECRET` | Express session secret | ✅ |
| `CLIENT_URL` | Frontend application URL | ✅ |
| `NODE_ENV` | Environment (development/production) | ✅ |

## 🚀 Deployment

### Production Deployment
1. **Set environment variables** in your hosting platform
2. **Update MONGO_URI** to production database
3. **Update CLIENT_URL** to production frontend URL
4. **Deploy to platforms like:**
   - Render
   - Heroku
   - Railway
   - DigitalOcean App Platform

### Current Deployment
The API is currently deployed at: `https://staycation-backend-8tzd.onrender.com/`


## 🧪 Testing

### GraphQL Playground
Access the GraphQL playground in development:
```
http://localhost:4000/graphql
```

### Sample Queries

**Fetch all hotels:**
```graphql
query {
  hotels {
    id
    name
    location
    price
    description
    features
    image
  }
}
```

**Create a booking:**
```graphql
mutation {
  addBooking(
    name: "John Doe"
    email: "john@example.com"
    phone: "123-456-7890"
    userId: "user_id_here"
    booking: {
      hotel: {
        name: "Ocean View Resort"
        location: "Malibu, CA"
        price: "$200/night"
      }
      nights: "3"
    }
  ) {
    id
    name
    email
    booking {
      hotel {
        name
        location
      }
      nights
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Performance Considerations

- **Database Indexing** - Add indexes for frequently queried fields
- **Query Optimization** - Use MongoDB aggregation for complex queries
- **Caching** - Implement Redis for frequent data access
- **Rate Limiting** - Add request rate limiting for production

## 🐛 Known Issues

- Password encryption method could be upgraded to bcrypt
- Error handling could be more granular
- API rate limiting needs implementation
- File upload size limits need configuration

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the GraphQL schema documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This is the backend API. Make sure to configure the frontend application to point to the correct GraphQL endpoint.