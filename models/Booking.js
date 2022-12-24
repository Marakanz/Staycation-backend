import mongoose from "mongoose";



const bookingSchema = new  mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    userId: {type: String, required: true },
    booking:
        {
            hotel: { 
                name: { type: String},
                location: { type: String },
                price: { type: String },
                description: { type: String },
                image: { type: String },
                features: [
                    { type: String }
                ]
            },
            nights: {type: String }
        }
},
{timestamps: true}
)

export default mongoose.model("Booking", bookingSchema)