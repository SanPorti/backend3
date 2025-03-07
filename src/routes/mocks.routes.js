import { Router } from "express";
import { faker } from "@faker-js/faker";
import userModel from "../models/user.js";
import { createHash } from "../utils/bcrypt.js";

const mocksRouter = Router();

mocksRouter.get('/mockingusers', async (req,res) => {
    try {const users = []
        for (let i = 0; i < 50; i ++) {
            users.push({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: createHash("coder123"),
                age: faker.number.int({min: 18, max: 90}),
                role: Math.random() <0.80 ? "Usuario" : "Admin",
        
            })
        }
        const mensaje = await userModel.create(users);
        res.status(200).send(mensaje)    
    } catch (error) {
        res.status(500).send(e);
    }
})

export default mocksRouter;