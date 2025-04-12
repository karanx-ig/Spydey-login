import "./database.js";

import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import qrcode from "qrcode";

import { UserModel } from "./models.js";

export const app = express();

app.use(express.json());

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({ message: "Fill all the details !!" });
    }
    if (password.length < 4) {
      return res.send({ message: "Password must be at least 4 characters!" });
    }
    const existingUser= await UserModel.findOne({email})
    if(existingUser){
      return res.status(400).send({message:"User already exists!"})
    }
    await UserModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
    
  }
  catch(error){
    console.error("Fail to register!", error);

    res.status(500).send({
      message: "Fail to register!",
    });

  }

  res.send({});
});

app.post("/api/login", async (req, res) => {
  try{
    const {  email, password } = req.body;
    if ( !email || !password) {
      return res.status(400).send({ message: "Details are incorrect !!" });
    }
    const User= await UserModel.findOne({email})
    if(!User){
      return res.status(400).send({message:"User not found!"})
    }
    if(!await bcrypt.compare(password, User.password)){
      return res.status(400).send({message:"Invalid password!"})
    }

    const token= jwt.sign(
      {
        id: User._id,
      },
      process.env.JWT_SECRET,
    );
    
  res.send({
    name: User.name,
    email: User.email,
    token
  });

    
  }
  catch(error){
    console.error("Fail to login!", error);

    res.status(500).send({
      message: "Fail to login!",
    });


  }
});

app.use("/api", async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(400).send({ message: "Token Venum Machii!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).send({ message: "Ihu dummy token raa!" });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Failed to verify token", error);
    return res.status(400).send({ message: "Invalid token!", error });
  }
});

app.get("/api/qrcode", async (req, res) => {
  try {
    if (!req.query.text) {
      return res.send({ message: "Text is required!" });
    }

    const imageUrl = await qrcode.toDataURL(req.query.text, {
      scale: 15,
    });

    res.send({ imageUrl });
  } catch (error) {
    console.error("Failed to generate QR", error);
    res.send({ message: "Failed to generate QR!", error });
  }
});
