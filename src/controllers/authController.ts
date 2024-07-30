import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcryptjs from 'bcryptjs';
import { emailRegex } from "../types/email";
import { regNumRegex } from "../types/reg_num";
import { generateToken } from "../utils/generateToken";


export const signup = async (req: Request, resp: Response) => {
    try {
        const { email, name, username, password, confirmPassword, reg_num, role = 'PARTICIPANT' } = req.body;

        if (!email || !name || !username || !password || !confirmPassword || !reg_num) {
            return resp.status(400).json({ message: "Please fill in all the details" });
        }

        //validating email format
        if (!emailRegex.test(email)) {
            return resp.status(400).json({ message: "Use VIT Email ID only" });
        }

        //validating reg_num format
        if (!regNumRegex.test(reg_num)) {
            return resp.status(400).json({ message: "Enter valid registration number" });
        }

        if (password !== confirmPassword) {
            return resp.send(400).json({ error: "Passwords do not match" });
        }

        //assuming user table is defined in prisma made
        const existingUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (existingUser) {
            return resp.status(400).json({ message: "User already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name,
                username: username,
                password: hashedPassword,
                reg_num: reg_num,
                role: role
            }
        })

        if (newUser) {

            //generating the token

            generateToken({ id: newUser.id, role: newUser.role }, resp);

            resp.status(201).json({
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                reg_num: newUser.reg_num,
                role: newUser.role
            })
        } else {
            resp.status(201).json({ error: "Something went wrong" });
        }
    }

    catch (error: unknown) {
        if (error instanceof Error) {
            console.log("Error in signup controller", error.message);

            // Prisma unique constraint violation
            if (error.message.includes('Unique constraint failed on the fields')) {
                if (error.message.includes('email')) {
                    return resp.status(400).json({ message: "Email already exists" });
                } else if (error.message.includes('username')) {
                    return resp.status(400).json({ message: "Username already exists" });
                }
            }

            return resp.status(500).json({ error: "Internal Server Error" });
        }
    }
}


export const login = async (req: Request, resp: Response) => {
    try {
        const { username, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if (!user) {
            return resp.status(400).json({
                error: "user does not exist. Please signup"
            })
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if (!isPasswordCorrect) {
            return resp.status(400).json({
                error: "Incorrect Password. Please try again"
            })
        }

        generateToken({ id: user.id, role: user.role }, resp);

        resp.status(200).json({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("error in login controller", error.message)
            resp.status(500).json({ error: "Internal Server Error" });
        };
    }
}

export const logout = async (req: Request, resp: Response) => {
    try {
        resp.clearCookie("jwt");
        resp.status(200).json({ message: "Logged out successfully" });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("Error in logout controller", error.message);
            resp.status(500).json({ error: "Internal Server Error" });
        }
    }
}
