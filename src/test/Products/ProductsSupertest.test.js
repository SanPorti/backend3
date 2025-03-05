import { expect } from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import dotenv from "dotenv";

dotenv.config();
const uriConexion = process.env.URI_MONGO;

const requester = supertest('http://localhost:8000');

describe('Rutas de productos', function () {
    let productId = null;

    before(async () => {
        await mongoose.connect(uriConexion);
    });

    after(async () => {
        await mongoose.connection.close();
    });

it("Ruta: api/products POST - Debería crear un nuevo producto", async () => {
    const newProduct = {
        title: "Producto Test",
        description: "Este es un producto de prueba",
        category: "Test",
        price: 100,
        stock: 10,
        code: `test-${Date.now()}`
    };

    const { statusCode, body } = await requester.post('/api/products').send(newProduct);
    console.log("Producto creado:", body); // Verifica el ID en la respuesta

    expect(statusCode).to.be.equal(201);
    expect(body).to.have.property("_id");

    productId = body._id; // Guardar el ID del producto para las siguientes pruebas
});


it("Ruta: api/products GET - Debería obtener la lista de productos", async () => {
    const { statusCode, body } = await requester.get('/api/products');

    console.log("Respuesta GET /api/products:", body); // Verifica el formato de respuesta

    expect(statusCode).to.be.equal(200);
    expect(body).to.be.an("object"); // La respuesta es un objeto
    expect(body.docs).to.be.an("array"); // La lista de productos está en `docs`
});

    

    it("Ruta: api/products/:pid GET - Debería obtener un producto por ID", async () => {
        if (!productId) throw new Error("productId es nulo o indefinido");
    
        const { statusCode, body } = await requester.get(`/api/products/${productId}`);
    
        console.log("Respuesta GET /api/products/:pid", body);
        expect(statusCode).to.be.equal(200);
        expect(body).to.have.property("_id").equal(productId);
    });
    

    it("Ruta: api/products/:pid PUT - Debería actualizar un producto", async () => {
        if (!productId) throw new Error("productId es nulo o indefinido");
    
        const updateData = { price: 150 }; // Cambiamos el precio
    
        const { statusCode, body } = await requester.put(`/api/products/${productId}`).send(updateData);
    
        console.log("Respuesta PUT /api/products/:pid", body); // Verifica la respuesta
    
        expect(statusCode).to.be.equal(200);
        expect(body).to.have.property("price").equal(150); // Asegurar que se actualizó el precio
    });
    

    it("Ruta: api/products/:pid DELETE - Debería eliminar un producto", async () => {
        if (!productId) throw new Error("productId es nulo o indefinido");
    
        const { statusCode, body } = await requester.delete(`/api/products/${productId}`);
    
        console.log("Respuesta DELETE /api/products/:pid", body); // Verifica la respuesta
    
        expect(statusCode).to.be.equal(200);
        expect(body).to.have.property("message").equal("Producto eliminado correctamente");
    });
    
});

