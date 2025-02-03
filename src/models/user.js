import { Schema, model } from "mongoose";
import cartModel from "./cart.js";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    rol: {
        type: String,
        default: "Usuario"
    }, 
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts"
    }
})

// Creo un carrito cada vez que creo un usuario
userSchema.post('save', async function name(userCreated) {
    try {
        const newCart = await cartModel.create({products: []})
        userCreated.cart = newCart._id
    } catch (e) {
        console.log(e);;
    }

})

const userModel = model("users", userSchema)

export default userModel