import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Story from "../models/Stories.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const resolvers = {
  Query: {
    hotels: async (parent) => {
      return await Hotel.find();
    },
    bookings: async (parent) => {
      return await Booking.find();
    },
    users: async (parent) => {
      return await User.find();
    },
    stories: async(parent) => {
      return await Story.find()
    }
  },

  Mutation: {
    getHotel: async (parent, args) => {
      return await Hotel.findById(args.id);
    },
    addHotel: async (parent, args) => {
        const hotel = new Hotel({
          name: args.name,
          location: args.location,
          price: args.price,
          description: args.desc,
          features: args.features,
          image: args.image,
        });

        return hotel.save();
    },
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
    getBooking: async (parent, args) => {
      return await Booking.findById(args.id);
    },
    getUserBookings: async (parent, args) => {
      try {
        const bookings = await Booking.find({ userId: args.userId });
        return bookings;
      } catch (e) {
        console.log(e);
      }
    },
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
    register: async (parent, args) => {
      const newUser = new User({
        email: args.email,
        isAdmin: args.admin,
        password: CryptoJS.AES.encrypt(
          args.password,
          process.env.PASS_WORD
        ).toString(),
      });

      try {
        const savedUser = await newUser.save();
        return savedUser;
      } catch (e) {
        console.log(e);
      }
    },
    login: async (parent, args) => {
      const user = await User.findOne({ email: args.email });
      !user && console.log("User does not exist");

      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_WORD
      );

      const realPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      realPassword !== args.password && console.log("Wrong credentials!");

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_PASSWORD,
        { expiresIn: "3d" }
      );

      const { password, ...others } = user._doc;
      console.log({ ...others, accessToken });
      return { ...others, accessToken };
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
    getUser: async (parent, args) => {
      try {
        const user = await User.findById(args.id);
        return user;
      } catch {
        console.log(e);
      }
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
    getStory: async(parent, args) => {
      try {
        const story = await Story.findById(args.id);
        return user;
      } catch {
        console.log(e);
      }
    }

  },
};

export default resolvers;
