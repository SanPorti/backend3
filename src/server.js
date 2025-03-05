import express from 'express'
import path from 'path'
import { __dirname } from './path.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { engine } from 'express-handlebars';
import { addLogger } from './utils/logger.js'
import passport from 'passport'
import initalizatePassport from './config/passport.config.js'
import MongoStore from 'connect-mongo'
import sessionRouter from './routes/sessions.routes.js'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import mongoose from 'mongoose'
//import cluster from 'cluster'
//import {cpus} from 'os'
import mocksRouter from './routes/mocks.routes.js'
import dotenv from "dotenv";
import userRouter from './routes/users.routes.js'
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express"

dotenv.config();
const uriConexion = process.env.URI_MONGO;
const claveDeSesion = process.env.SECRET_SESSION;

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: "Documentacion de API ecommerce",
            description: "API de mi proyecto final"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const app = express()
const PORT = 8000

const specs = swaggerJsDoc(swaggerOptions)

app.use(express.json())
app.use(cookieParser("CoderSecret")) //Si agrego contraseña "firmo" las cookies
app.use(session({
    store: MongoStore.create({
        mongoUrl: uriConexion,
        mongoOptions: {},
        ttl: 15
    }),
    secret: claveDeSesion,
    resave: true,
    saveUninitialized: true
}))

mongoose.connect(uriConexion)
.then(() => console.log("DB is connected"))
.catch((e) => console.log("Error al conectarme a DB:", e))

initalizatePassport()
app.use(passport.initialize())
app.use(passport.session())
app.engine('handlebars', engine());
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views')) //Concateno evitando erroes de / o \
app.use(addLogger)

//Rutas
app.use('/public', express.static(__dirname + '/public')) //Concateno rutas
app.use('/api/sessions', sessionRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/mocks', mocksRouter)
app.use('/api/users', userRouter)
app.use('/api/docs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

app.post('/', (req,res) => {
    req.logger.warn("Warning!!!!")
    req.logger.error("ERORRRRR!")
    req.logger.info("ERORRRRR!")
    res.send("Hola2")
})

app.get('/operacionsimple', (req,res) => {
    let sum = 0
    for(let i = 0; i< 1e4; i++) {
        sum += i
    }
    res.status(200).send({sum})
})

app.get('/operacioncompleja', (req,res) => {
    try {
        let sum = 0
        for(let i= 0; 1e6; i++) {
            sum += i
        }
        res.status(200).send({sum})
    }catch(e) {
        console.log(e);
        res.status(500).send(e)
    }

})


app.get('/', (req,res) => {
    res.send("Hola!")
})


app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})


