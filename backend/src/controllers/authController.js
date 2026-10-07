import { User } from "../models/User.js";
import { compareString, hashString } from "../utils/auth.js";
import { logError } from "../utils/error.js";
import { generateToken } from "../utils/jwt.js";

async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [
        { username },
        { email }
      ]
    });

    if (existingUser) return res.status(409).json({message: "User already exists!"});

    const hashedPassword = await hashString(password);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    const token = generateToken(user._id);

    res.status(201).json({
      token: `Bearer ${token}`,
      message: "Successfully registed!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    logError("Register error: ", err);
    return res.status(500).json({
      message: "Internal server error!"
    })
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(401).json({message: "Invalid credentials!"});

    const matchPassword = await compareString(password, user.password);

    if (!matchPassword) return res.status(401).json({message: "Invalid credentials!"});

    const token = generateToken(user._id)

    return res.status(200).json({
      token: `Bearer ${token}`,
      message: "Successfully login!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    logError("Login error: ", err);
    return res.status(500).json({
      message: "Internal server error!"
    })
  }
}

async function getMe(req, res) {
  try {
    const userId = req.id;

    const user = await User.findOne({
      _id: userId
    })

    if (!user) return res.status(401).json({message: "User does not exist!"});

    return res.status(200).json({
      user: {
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    logError("Getme error: ", err);
    return res.status(500).json({
      message: "Internal server error!"
    })
  }
}

export {
  register,
  login,
  getMe
};
