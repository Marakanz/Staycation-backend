import mongoose from "mongoose";


const HotelSchema =new  mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    features: [
        { type: String }
    ]
},
{timestamps: true}
)

export default mongoose.model("Hotel", HotelSchema);