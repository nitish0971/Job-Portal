import {catchAsyncError} from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../middlewares/error.js';
import { User } from '../model/userSchema.js';
import {sendToken} from '../utils/jwtToken.js'
export const register = catchAsyncError(async (req,res,next)=>{
    const {name,email,phone,role,password} = req.body;
    if(!name || !email || !phone || !role || !password){
        return next(new ErrorHandler("Please fill all details"));
    }
    if(phone.length>10){
        return next(new ErrorHandler("Phone number cannot exceed 10 digits"));
    }
    const isEmail = await User.findOne({email});
    if(isEmail){
        return next(new ErrorHandler("Email already exists"));
    }
    const passwordCheck = (password) => {
        const hasCapital = /[A-Z]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
        return hasCapital && hasSpecial;
    };
    
    if (!passwordCheck(password)) {
        return next(new ErrorHandler("Password must contain at least one capital letter and one special character."))
    }

    const user = await User.create({
        name,
        email,
        phone,
        role,
        password,
    });
    sendToken(user,200,res,"User Registered succesfully")
});



export const login = catchAsyncError(async(req,res,next)=>{
    const {email,password,role} = req.body;
    if(!email || !password || !role){
        return next(new ErrorHandler("Please provide all the input fields",400))
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",404));
    }
    if(user.role!==role){
        return next(new ErrorHandler("User with this role not found",400));
    }
    sendToken(user,200,res,"User logged in succesfully!");
});



export const logout = catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie("token","",{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    .json({
        success:true,
        message:"User logged out succesfully",
    });
});


export const getUser = catchAsyncError((req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        user
    });
});