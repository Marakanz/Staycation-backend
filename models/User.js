import mongoose from "mongoose"


const userSchema = new  mongoose.Schema({
    
    email: { type: String, required: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    googleId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    image: { type: String }
},
{timestamps: true}
)

export default mongoose.model("User", userSchema );