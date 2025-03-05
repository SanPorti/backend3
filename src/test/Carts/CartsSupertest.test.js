import { expect } from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import dotenv from "dotenv";

dotenv.config();
const uriConexion = process.env.URI_MONGO;
const requester = supertest('http://localhost:8000');

describe('Rutas de carritos', function () {
    let cartId;
    let productId = "67c1131d94ba1709d2f4ce7f"; // Reemplaza con un ID válido

    before(async () => {
        await mongoose.connect(uriConexion);
    });

    it('Ruta: api/carts POST - Debería crear un nuevo carrito', async () => {
        const { statusCode, body } = await requester.post('/api/carts').send({});
        expect(statusCode).to.equal(201);
        expect(body).to.have.property('_id');
        cartId = body._id;
    });

    it('Ruta: api/carts/:cid GET - Debería obtener un carrito por ID', async () => {
        const { statusCode, body } = await requester.get(`/api/carts/${cartId}`);
        expect(statusCode).to.equal(200);
        expect(body).to.have.property('_id', cartId);
    });

    it('Ruta: api/carts/:cid/products/:pid POST - Debería agregar un producto al carrito', async () => {
        const { statusCode, body } = await requester.post(`/api/carts/${cartId}/products/${productId}`).send({ quantity: 2 });
        expect(statusCode).to.equal(200);
        expect(body).to.have.property('message', 'Producto agregado al carrito');
    });

    it('Ruta: api/carts/:cid/products/:pid PUT - Debería actualizar la cantidad de un producto en el carrito', async () => {
        const { statusCode, body } = await requester.put(`/api/carts/${cartId}/products/${productId}`).send({ quantity: 5 });
        expect(statusCode).to.equal(200);
        expect(body).to.have.property('message', 'Cantidad actualizada correctamente');
    });

    it('Ruta: api/carts/:cid/products/:pid DELETE - Debería eliminar un producto del carrito', async () => {
        const { statusCode, body } = await requester.delete(`/api/carts/${cartId}/products/${productId}`);
        expect(statusCode).to.equal(200);
        expect(body).to.have.property('message', 'Producto eliminado correctamente');
    });

    it('Ruta: api/carts/:cid DELETE - Debería eliminar un carrito', async () => {
        const { statusCode, body } = await requester.delete(`/api/carts/${cartId}`);
        expect(statusCode).to.equal(200);
        expect(body).to.have.property('message', 'Carrito eliminado correctamente');
    });
});
