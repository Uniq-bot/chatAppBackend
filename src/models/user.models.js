import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    pic:{
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",

    },
    isAdmin:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});
// Hash password before saving
userSchema.pre('save', async function(){
    if(!this.isModified('password')){
        return ;
    }
    try {
        const salt= await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password, salt);
        return this.password;
    } catch (error) {
        console.log("Error in hashing password", error);
    }
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User= mongoose.model('User', userSchema);
export default User;