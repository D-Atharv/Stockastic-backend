import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs";
import { emailRegex } from "../types/email";
import { regNumRegex } from "../types/regNo";
import { generateToken } from "../utils/generateToken";
import { addTokenToBlacklist } from "../utils/tokenBlackList";
import { User } from "@prisma/client";

export const signup = async (req: Request, resp: Response) => {
  try {
    const {
      email,
      name,
      password,
      passwordConfirm,
      regNo,
      phone,
      role = "PARTICIPANT",
    } = req.body;

    if (!email || !name || !password || !passwordConfirm || !regNo || !phone) {
      console.log("haha");
      return resp
        .status(400)
        .json({ message: "Please fill in all the details" });
    }

    //validating email format
    if (!emailRegex.test(email)) {
      return resp.status(400).json({ message: "Use VIT Email ID only" });
    }

    //validating regNo format
    if (!regNumRegex.test(regNo)) {
      return resp
        .status(400)
        .json({ message: "Enter valid registration number" });
    }

    if (password !== passwordConfirm) {
      return resp.send(400).json({ error: "Passwords do not match" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        regNo: regNo,
        role: role,
        phone: phone,
      },
    });

    resp.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      regNo: newUser.regNo,
      role: newUser.role,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error in signup controller", error.message);

      // Prisma unique constraint violation
      if (error.message.includes("Unique constraint failed on the fields")) {
        if (error.message.includes("email")) {
          return resp.status(400).json({ message: "Email already exists" });
        } else if (error.message.includes("regNo")) {
          return resp
            .status(400)
            .json({ message: "Registration number already exists" });
        } else if (error.message.includes("phone")) {
          return resp
            .status(400)
            .json({ message: "Phone number already exists" });
        }
      }
      return resp.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const login = async (req: Request, resp: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return resp.status(404).json({
        error: "User does not exist. Please signup",
      });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return resp.status(401).json({
        error: "Incorrect Password. Please try again",
      });
    }

    const token = generateToken({ id: user.id }, resp);

    resp.cookie("jwt", token, {
      secure: false,
      maxAge: 3600000,
      sameSite: "none",
    });

    resp.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("error in login controller", error.message);
      resp.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// export const logout = async (req: Request, resp: Response) => {
//     try {
//         resp.clearCookie("jwt");
//         resp.status(200).json({ message: "Logged out successfully" });
//     } catch (error: unknown) {
//         if (error instanceof Error) {
//             console.log("Error in logout controller", error.message);
//             resp.status(500).json({ error: "Internal Server Error" });
//         }
//     }
// }

export const logout = async (req: Request, resp: Response) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      addTokenToBlacklist(token); // Add token to blacklist
    }

    resp.cookie("jwt", "", {
      expires: new Date(0), // Expire immediately
      httpOnly: true, // Helps mitigate XSS attacks
      // secure: process.env.NODE_ENV === 'production', // Only use in HTTPS environments
      sameSite: "strict", // Helps prevent CSRF attacks
    });

    resp.status(200).json({ message: "Logged out successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error in logout controller", error.message);
      resp.status(500).json({ error: "Internal Server Error" });
    }
  }
};
