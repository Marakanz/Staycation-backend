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
    password: String
    isAdmin: Boolean
    accessToken: String
  }

  #QUERIES
  type Query {
    hotels: [Hotel!]!
  }

  type Query {
    bookings: [Booking!]!
  }

  type Query {
    users: [User!]!
  }
  type Query {
    stories: [Story!]!
  }

  type Query {
    getHotel(id: ID!) : Hotel!
  }

  type Query {
    getBooking(id: ID!) : Booking!
  }
  type Query {
    getUserBookings(userId: ID!): [Booking!]!
  }
  type Query {
    getUser(id: ID!): User!
  }
  type Query {
    getStory(id: ID!): Story!
  }

  #MUTATIONS
  #HOTEL MUTATIONS
  type Mutation {
    addHotel(name: String!, location: String!, price: String!, image: String, 
        desc: String, features: [String]): Hotel!
  }
  type Mutation {
    updateHotel(id: ID!,name: String, location: String, price: String, image: String, 
      desc: String, features: [String]): Hotel!
  }

  type Mutation {
    deleteHotel(id: ID!): String!
  }
  
  #BOOKING MUTATIONS
  type Mutation {
    addBooking(name: String!, email: String!, phone: String!, userId: String, 
        booking: singleBookingInput): Booking!
  }
  type Mutation {
    updateBooking(id: ID!,name: String, email: String, phone: String, userId: String, 
      booking: singleBookingInput): Booking!
  }

  type Mutation {
    deleteBooking(id: ID!): String!
  }
 

  #AUTH MUTATIONS
  type Mutation {
    register(email: String!, password: String!): User!
  }

  type Mutation {
    login (email: String!, password: String!): User!
  }

  #USER MUTATIONS
  type Mutation {
    updateUser(id: ID!, email: String, password: String): User!
  }
  type Mutation {
    deleteUser(id: ID!): String!
  }

  

  #STORY MUTATIONS

  type Mutation {
    updateStory(id: ID!, name: String, title: String, body: String): Story!
  }

  type Mutation {
    addStory(name: String!, title: String!, body: String!): Story!
  }

  type Mutation {
    deleteStory(id: ID!): String!
  }

  
`;

export default typeDefs;