import mongoose from "mongoose";
var Schema = mongoose.Schema;

const userSchema = new Schema({
  unique_id: String,
  token: String,
  userlogin_status: String,
  email: String,
  account_name: String,
  name: String,
  // password:String,
  // email:String,
  // status:String,
  // designation:String,
  // contact:String,
});
const myDB = mongoose.connection.useDb("ravenfrontend");
const User = myDB.model("userDetailsSession", userSchema);

export default User
