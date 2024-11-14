import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  UserModel  from "../models/userModel.js";

export const register = async (req, res) => {
  const { username, email, password, phone_number } = req.body;

  console.log(username, email, password, phone_number)

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    const newUser = await UserModel.create({
      username,
      phone_number,
      email,
      password: hashedPassword, 
    });
    

    console.log(newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const user = await UserModel.findOne({ username });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log(isPasswordValid)

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const userInfo = {email : user.email, phone_number : user.phone_number, username: user.username, id: user._id};

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure:true,
      maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
