import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema({
  email: String,
  name : String,
  days : Array,
  time : String,
  message : String,
  created_time : { type : Date, default: Date.now }
}, {
	collection : `notifications`
})

export default new mongoose.model('notifications', NotificationSchema)

