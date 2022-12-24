import mongoose  from "mongoose";


const storySchema = new  mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    
})

export default mongoose.model("Story", storySchema);