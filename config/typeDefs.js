import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Upload
  
  type Hotel {
    id: ID
    name: String
    location: String
    price: String
    image: String
    description: String
    features: [String]
  }

  input inputHotel {
    id: ID
    name: String
    location: String
    price: String
    image: String
    description: String
    features: [String]
  }

  input singleBookingInput {
    hotel: inputHotel
    nights: String
  }

  type singleBooking {
    hotel: Hotel
    nights: String
  }

  type Booking {
    id: ID
    name: String
    email: String
    phone: String
    userId: String
    booking: singleBooking
  }
  
  type Story {
    id: ID
    name: String
    title: String
    body: String
  }

  type User {
    _id: ID!
    email: String!
    isAdmin: Boolean
    accessToken: String
    firstName: String
    lastName: String
    image: String
    googleId: String
    createdAt: String
    updatedAt: String
  }

  # Better auth response type
  type AuthResponse {
    success: Boolean!
    message: String
    user: User
    token: String
  }

  # Input types for better validation
  input RegisterInput {
    email: String!
    password: String!
    firstName: String
    lastName: String
    admin: Boolean
  }

  input LoginInput {
    email: String!
    password: String!
  }

  # COMBINED QUERIES - This was the main issue!
  type Query {
    hotels: [Hotel!]!
    bookings: [Booking!]!
    getUsers: [User!]!
    stories: [Story!]!
    getHotel(id: ID!): Hotel!
    getBooking(id: ID!): Booking!
    getUserBookings(userId: ID!): [Booking!]!
    getUser(id: ID!): User!
    getStory(id: ID!): Story!
    getAuthStatus: AuthResponse!
  }

  # COMBINED MUTATIONS
  type Mutation {
    # HOTEL MUTATIONS
    addHotel(name: String!, location: String!, price: String!, image: String, 
        desc: String, features: [String]): Hotel!
    updateHotel(id: ID!, name: String, location: String, price: String, image: String, 
      description: String, features: [String]): Hotel!
    deleteHotel(id: ID!): String!
    
    # BOOKING MUTATIONS
    addBooking(name: String!, email: String!, phone: String!, userId: String, 
        booking: singleBookingInput): Booking!
    updateBooking(id: ID!, name: String, email: String, phone: String, userId: String, 
      booking: singleBookingInput): Booking!
    deleteBooking(id: ID!): String!
   
    # AUTH MUTATIONS - IMPROVED
    register(input: RegisterInput!): User!
    login(input: LoginInput!): User!
    # Alternative: if you prefer individual parameters
    registerUser(email: String!, password: String!, admin: Boolean): User!
    loginUser(email: String!, password: String!): User!
    googleAuth(tokenId: String!): AuthResponse!
    setUserAdmin(userId: ID!, isAdmin: Boolean!): User!

    # USER MUTATIONS
    updateUser(id: ID!, email: String, password: String): User!
    deleteUser(id: ID!): String!

    # STORY MUTATIONS
    addStory(name: String!, title: String!, body: String!): Story!
    updateStory(id: ID!, name: String, title: String, body: String): Story!
    deleteStory(id: ID!): String!
  }
`;

export default typeDefs;
