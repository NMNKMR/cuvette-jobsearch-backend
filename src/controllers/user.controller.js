import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res)=> {
    const {name, email, mobile, password} = req.body;

    if(
        [name, email, mobile, password].some((field)=> !field || field.trim()==="")
    ) throw new ApiError(400, "All fields are required!");
    
    const userExists = await User.findOne({$or: [{email}, {mobile}]});

    if(userExists) throw new ApiError(409, "User with email or mobile already exists");

    const createdUser = await User.create({
        name,
        email,
        mobile,
        password,
    })

    const user = await User.findById(createdUser._id).select("-password");

    if(!user) throw new ApiError(500, "Error occurred while registering the user!");

    res.status(201).json(
        new ApiResponse(201, "User registered successfully!", {user})
    )
    
})

const loginUser = asyncHandler(async (req, res)=> {
    const {email, password} = req.body;
    
    if(!email) throw new ApiError(400, "Email is required!");
    if(!password) throw new ApiError(400, "Password is required!");

    const user = await User.findOne({email});
    if(!user) throw new ApiError(404, "User does not exists!");

    const isPasswordCorrect = await user.isPasswordValid(password);
    if(!isPasswordCorrect) throw new ApiError(401, "Invalid user credentials!")

    const accessToken = user.generateAccessToken();
    delete user["password"];

    res.status(200).json(
        new ApiResponse(200, "User logged in successfully!", {
            user,
            accessToken
        })
    )
})

export {
    registerUser,
    loginUser,
}