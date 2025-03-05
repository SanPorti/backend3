import mongoose from "mongoose";
import userModel from "../../models/user.js";
import Assert from "assert"; 
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();
const uriConexion = process.env.URI_MONGO;

mongoose.connect(uriConexion);

const assert = Assert.strict;

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
        assert.deepStrictEqual(typeof newUser.email, "string");
    })

    it('Obtener todos los usuarios', async () => {
        const users = await userModel.find()
        assert.strictEqual(Array.isArray(users), true)
    })

    it('Obtener un usuario', async () => {
        const user = await userModel.findById(idUser)
        assert.strictEqual(typeof user, "object")
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
        assert.deepStrictEqual(typeof userUpdated.email, "string");
    })

    it("Eliminar Un usuario", async () => {
        const userDelete = await userModel.findByIdAndDelete(idUser)
        let rta = await userModel.findById(userDelete._id)
        assert.strictEqual(rta, null)
    })
});