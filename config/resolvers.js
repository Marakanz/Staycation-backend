import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Story from "../models/Stories.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const resolvers = {
  Query: {
    hotels: async (parent) => {
      try {
        console.log('Fetching hotels...');
        const hotels = await Hotel.find();
        console.log('Found hotels:', hotels.length);
        return hotels;
      } catch (error) {
        console.error('Error fetching hotels:', error);
        throw error;
      }
    },
    bookings: async (parent) => {
      try {
        console.log('Fetching bookings...');
        const bookings = await Booking.find();
        console.log('Found bookings:', bookings.length);
        return bookings;
      } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
    },
    getUsers: async () => {
      try {
        console.log('Fetching users...');
        const users = await User.find();
        console.log('Found users:', users.length);
        return users;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    }, // Fixed: removed extra closing brace
    stories: async (parent) => {
      try {
        console.log('Fetching stories...');
        const stories = await Story.find();
        console.log('Found stories:', stories.length);
        return stories;
      } catch (error) {
        console.error('Error fetching stories:', error);
        throw error;
      }
    },
    getHotel: async (parent, args) => {
      try {
        const hotel = await Hotel.findById(args.id);
        return hotel;
      } catch (error) {
        console.error('Error fetching hotel:', error);
        throw error;
      }
    },
    getBooking: async (parent, args) => {
      try {
        const booking = await Booking.findById(args.id);
        return booking;
      } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
      }
    },
    getUserBookings: async (parent, args) => {
      try {
        const bookings = await Booking.find({ userId: args.userId });
        return bookings;
      } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
      }
    },
    getUser: async (parent, args) => {
      try {
        const user = await User.findById(args.id);
        return user;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },
    getStory: async (parent, args) => {
      try {
        const story = await Story.findById(args.id);
        return story; // Fixed: was returning 'user' instead of 'story'
      } catch (error) {
        console.error('Error fetching story:', error);
        throw error;
      }
    },
    getAuthStatus: async (_, __, { req }) => {
      if (req.user) {
        return {
          success: true,
          user: req.user
        };
      }
      return {
        success: false,
        message: "Not authenticated"
      };
    },
  },

  Mutation: {
    // ... rest of your mutations remain the same
    addHotel: async (parent, args) => {
      try {
        const hotel = new Hotel({
          name: args.name,
          location: args.location,
          price: args.price,
          description: args.desc,
          features: args.features,
          image: args.image,
        });
        return hotel.save();
      } catch (error) {
        console.error('Error adding hotel:', error);
        throw error;
      }
    },
    // ... include all your other mutations here
    updateHotel: async (parent, args) => {
      try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              location: args.location,
              price: args.price,
              image: args.image,
              description: args.description,
              features: args.features,
            },
          },
          { new: true }
        );
        return updatedHotel;
      } catch (e) {
        console.log(e);
      }
    },
    deleteHotel: async (parent, args) => {
      try {
        await Hotel.findByIdAndDelete(args.id);
        return "Hotel has been deleted";
      } catch (e) {
        console.log(e);
      }
    },

    //BOOKING MUTATION
    addBooking: async (parent, args) => {
      try {
        const booking = new Booking({
          name: args.name,
          email: args.email,
          phone: args.phone,
          userId: args.userId,
          booking: args.booking,
        });

        return booking.save();
      } catch (e) {
        console.log(e);
      }
    },
    updateBooking: async (parent, args) => {
      try {
        const updatedBooking = await Booking.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              email: args.email,
              phone: args.phone,
              userId: args.image,
              booking: args.booking,
            },
          },
          { new: true }
        );
        return updatedBooking;
      } catch (e) {
        console.log(e);
      }
    },
    deleteBooking: async (parent, args) => {
      try {
        await Booking.findByIdAndDelete(args.id);
        return "Booking has been deleted";
      } catch (e) {
        console.lof(e);
      }
    },

    //AUTH MUTATION
    googleAuth: async (_, { tokenId }, { req }) => {
      // This is for client-side Google authentication
      // If you're using server-side flow with passport, you may not need this
      try {
        // Verify token with Google (would require google-auth-library package)
        // This is a placeholder for client-side auth flow
        // For the server flow with passport, this is handled by the /auth/google routes
        return {
          success: true,
          message: "Authentication successful",
          user: req.user
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    },
    setUserAdmin: async (parent, args, context) => {
      // Check if the requester is an admin
      if (!context.user || !context.user.isAdmin) {
        throw new Error("Not authorized. Only admins can perform this action.");
      }
      
      try {
        const updatedUser = await User.findByIdAndUpdate(
          args.userId,
          { isAdmin: args.isAdmin },
          { new: true }
        );
        
        if (!updatedUser) {
          throw new Error("User not found");
        }
        
        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
    },

   register: async (parent, { input }) => {
    try {
      // Destructure from the input object
      const { email, password, firstName, lastName, admin } = input;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Validate input
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please provide a valid email address");
      }

      // Create new user
      const newUser = new User({
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        isAdmin: admin || false,
        password: CryptoJS.AES.encrypt(password, process.env.PASS_WORD).toString(),
      });

      const savedUser = await newUser.save();
      
      // Generate JWT token
      const accessToken = jwt.sign(
        {
          id: savedUser._id,
          isAdmin: savedUser.isAdmin,
        },
        process.env.JWT_PASSWORD,
        { expiresIn: "3d" }
      );

      // Return user without password
      const { password: userPassword, ...userWithoutPassword } = savedUser._doc;
      
      console.log("User registered successfully:", userWithoutPassword.email);
      return { 
        ...userWithoutPassword, 
        accessToken 
      };

    } catch (error) {
      console.error("Registration error:", error.message);
      throw new Error(error.message);
    }
},
    login: async (parent, { input }) => {
  try {
    // Validate input
    // Destructure from input object
      const { email, password } = input; 

    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if user has a password (in case of Google OAuth users)
    if (!user.password) {
      throw new Error("Please login with Google or reset your password");
    }
    // Decrypt and verify password
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_WORD
    );
    const realPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (realPassword !== password) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_PASSWORD,
      { expiresIn: "3d" }
    );

    // Return user without password
    const { password: userPassword, ...userWithoutPassword } = user._doc;
    console.log("User logged in successfully:", userWithoutPassword.email);
    return { 
      ...userWithoutPassword, 
      accessToken 
    };
  } catch (error) {
    console.error("Login error:", error.message);
    throw new Error(error.message);
  }
},
    
    //USER MUTATION
    updateUser: async (parent, args) => {
      if (args.password) {
        args.password = CryptoJS.AES.encrypt(
          args.password,
          process.env.PASS_WORD
        ).toString();
      }
      const updatedUser = await User.findByIdAndUpdate(
        args.id,
        {
          $set: {
            email: args.email,
            password: args.password,
          },
        },
        { new: true }
      );
      console.log(updatedUser);
      return updatedUser;
    },
    deleteUser: async (parent, args) => {
      await User.findByIdAndDelete(args.id);
      const result = " User has been deleted";
      return result;
    },
  

    //STORY MUTATION
    addStory: async (parent, args) => {
      try {
          const story = new Story({
            name: args.name,
            title: args.title,
            body: args.body
          })
          return story.save()
      } catch (e) {
          console.log(e);
      }
    },

    deleteStory: async(parent, args) => {
      await Story.findByIdAndDelete(args.id)
      return "This Story has been deleted";
    }, 

    updateStory: async(parent, args) => {
      try {
        const updatedStory = await Story.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              title: args.title,
              body: args.body
            },
          },
          { new: true }
        );
        return updatedStory;
      } catch (e) {
        console.log(e);
      }
    },
  },
};

export default resolvers;