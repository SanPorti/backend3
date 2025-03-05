import cartModel from '../models/cart.js'

export const getCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid).populate("products.id_prod");
        
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        res.status(200).json(cart);
    } catch (e) {
        console.error("Error obteniendo el carrito:", e);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const createCart = async (req,res) => {
    try {
        const rta = await cartModel.create({products: []})
        res.status(201).send(rta)
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}

export const insertProductCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Cantidad inválida" });
        }

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const productIndex = cart.products.findIndex(prod => prod.id_prod.toString() === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ id_prod: pid, quantity });
        }

        await cart.save();
        res.status(200).json({ message: "Producto agregado al carrito", cart });
    } catch (e) {
        console.error("Error agregando producto:", e);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const updateProductCart = async (req,res) => {
    try {
        const cartId = req.params.cid
        const {newProduct} = req.body
        const cart = await cartModel.findOne({_id: cartId})
        cart.products = newProduct
        cart.save()
        res.status(200).send(cart)
    }catch(e){
        res.status(500).render('templates/error', {e})
    }
}

export const updateQuantityProductCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Cantidad inválida" });
        }

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        console.log("Carrito encontrado:", JSON.stringify(cart, null, 2)); // Debugging

        const product = cart.products.find(prod => prod.id_prod._id.toString() === pid);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        product.quantity = quantity;
        await cart.save();

        res.status(200).json({ message: "Cantidad actualizada correctamente", cart });

    } catch (e) {
        console.error("Error actualizando cantidad:", e);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const deleteProductCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        console.log("Carrito encontrado:", JSON.stringify(cart, null, 2)); // Debugging

        const productIndex = cart.products.findIndex(p => p.id_prod._id.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        res.status(200).json({ message: "Producto eliminado correctamente", cart });
    } catch (e) {
        console.error("Error eliminando producto:", e);
        res.status(500).json({ message: "Error en el servidor" });
    }
};




export const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await cartModel.findByIdAndDelete(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        res.status(200).json({ message: "Carrito eliminado correctamente" });
    } catch (e) {
        console.error("Error eliminando el carrito:", e);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
