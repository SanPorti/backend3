import { expect } from "chai";
import mongoose from "mongoose";
import supertest from "supertest";
import crypto from "crypto";
import dotenv from "dotenv";
import { __dirname } from "../../path.js";

dotenv.config();
const uriConexion = process.env.URI_MONGO;

const requester = supertest('http://localhost:8000')

describe('Rutas de sesion de mi usuario', function () {
    let user = {}
    let cookie = {}

    before(async () => {
        mongoose.connect(uriConexion)
            .then(() => console.log("DB is connected"))
            .catch((e) => console.log("Error al conectarme a DB:", e))
    })

    it('Ruta: api/sessions/register POST', async () => {
        let newUser = {
            first_name: "Lola",
            last_name: "Albornoz",
            email: `lola${crypto.randomBytes(5).toString('hex')}@albornoz.com`,
            password: "1234",
            age: 25
        }

        const { statusCode, request } = await requester.post('/api/sessions/register').send(newUser);
        user = request._data;
        expect(statusCode).to.be.equal(201);

    })

    it('Ruta: api/sessions/login POST', async () => {

        const result = await requester.post('/api/sessions/login').send(user);
        const cookieResult = result.headers["set-cookie"][0];
        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
        }

        expect(cookie.name).to.be.ok.and.equal("token");
        expect(cookie.value).to.be.ok;

    })

    it('Ruta: api/sessions/current GET', async () => {
        const loginResult = await requester.post('/api/sessions/login').send(user);
        const cookieResult = loginResult.headers['set-cookie'][0];
        const token = cookieResult.split(';')[0].split('=')[1]; // Extraer el token
    
        console.log("🔍 Cookies recibidas en login:", cookieResult); // <-- Verificar cookies

        const response = await requester
            .get('/api/sessions/current')
            .set('Cookie', `token=${token}`); 
    
        expect(response.statusCode).to.equal(200);
        expect(response.body.email).to.equal(user.email);  
    });
    
    // DEJE COMENTADA LA RUTA CURRENT PORQUE SINCERAMENTE NO PUDE SOLUCIONAR EL ERROR QUE NO ME PERMITIA QUE PASE LOS TESTS

})