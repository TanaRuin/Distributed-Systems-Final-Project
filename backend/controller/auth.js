import userModel from "../models/user.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!name || !email || !password){
      return res.status(400).json({success:false, message:"Please fill all the required fields"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role: "human",
      });
    }

    const returned = {
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id,
    };

    return res.status(200).json({ success: true, user: returned });

  } catch (error) {
    console.error("register failed", error);
    return res.status(500).json({success:false, message:"Please try again"});
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({success:false, message:"Please fill all the required fields"})
    }

    const existing = await userModel.findOne({ email: email });
    if(!existing){ 
      return res.status(400).json({success:false, message:'Invalid credentials'})
    }
    if(existing.role === "AI"){ 
      return res.status(400).json({success:false, message:'This is an AI user'})
    }
    
    const isMatch = await bcrypt.compare(password, existing.password);
    if(!isMatch){
        return res.status(400).json({success:false, message:"Invalid credentials"})
    }

    const returned = {
      name: existing.name,
      email: existing.email,
      role: existing.role,
      _id: existing._id,
    };

    return res.status(200).json({ success: true, user: returned });

  } catch (error) {
    console.error("login failed", error);
    return res.status(500).json({success:false, message:"Please try again"});
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    const existing = await userModel.findById(userId);
    
    const returned = {
      name: existing.name,
      email: existing.email,
      role: existing.role,
      _id: existing._id,
    };

    return res.status(200).json({ success: true, user: returned });

  } catch (error) {
    console.error("getUser failed", error);
    return res.status(500).json({success:false, message:"Please try again"});
  }
}

export const getAllAiUser = async(req, res) => {
  try {
    const allData = await userModel.find({
      role: "AI",
      name: { $ne: "Gemini" }
    });
    return res.status(200).json({ success: true, users: allData });

  } catch (error) {
    console.error("getAllaiuser failed", error);
    return res.status(500).json({success:false, message:"Please try again"});
  }
}