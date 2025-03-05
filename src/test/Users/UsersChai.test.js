import mongoose from "mongoose";
import userModel from "../../models/user.js";
import { expect } from "chai";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();
const uriConexion = process.env.URI_MONGO;

mongoose.connect(uriConexion);

describe ('Testing users', async () => {
    let idUser;

    it('Crear un usuario', async () => {
        const user = {
            first_name: "Juan",
            last_name: "Perez", 
            email: `juan${crypto.randomBytes(5).toString('hex')}@perez.com`, 
            password: "1234",
            age: 31,
        }

        const newUser = await userModel.create(user);
        idUser = newUser._id;
        expect(newUser).to.have.property("email");
    })

    it('Obtener todos los usuarios', async () => {
        const users = await userModel.find();
        expect(Array.isArray(users)).to.be.ok;
    })

    it('Obtener un usuario', async () => {
        const user = await userModel.findById(idUser);
        expect(user).to.have.property("cart");
    })

    it('Actualizar un usuario', async () => {
        const user = {
            first_name: "Lucas",
            last_name: "Perez", 
            email: `lucas${crypto.randomBytes(5).toString('hex')}@perez.com`, 
            password: "1234",
            age: 31,
        }

        const userUpdated = await userModel.findByIdAndUpdate(idUser, user );
        const userRename = await userModel.findById(userUpdated._id)
        expect(userRename).to.property("first_name").to.be.equal("Lucas");
    })

    it("Eliminar Un usuario", async () => {
        const userDelete = await userModel.findByIdAndDelete(idUser);
        let rta = await userModel.findById(userDelete._id);
        expect(rta).to.be.equal(null);
    })
});