import express from 'express'
import path from 'path'
import { __dirname } from './path.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { engine } from 'express-handlebars';
import { addLogger } from './utils/logger.js'
// import passport from 'passport'
// import initalizatePassport from './config/passport.config.js'
import MongoStore from 'connect-mongo'
import sessionRouter from './routes/sessions.routes.js'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import mongoose from 'mongoose'
//import cluster from 'cluster'
//import {cpus} from 'os'
import mocksRouter from './routes/mocks.routes.js'

const app = express()
const PORT = 8000
//const fileStorage = new FileStore(session)
app.use(express.json())
app.use(cookieParser("CoderSecret")) //Si agrego contraseña "firmo" las cookies
app.use(session({
    //ttl Time to Live tiempo de vida (segundos)
    //retries: Cantidad de veces que el servidor va a intentar leer ese archivo
    //store: new fileStorage({path: './src/sessions', ttl: 10, retries: 1 }),
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://admin:12345@cluster0.etdwv.mongodb.net/backend3",
        mongoOptions: {},
        ttl: 15
    }),
    secret: 'SessionSecret',
    resave: true,
    saveUninitialized: true
}))

mongoose.connect("mongodb+srv://admin:12345@cluster0.etdwv.mongodb.net/backend3")
.then(() => console.log("DB is connected"))
.catch((e) => console.log("Error al conectarme a DB:", e))

// initalizatePassport()
// app.use(passport.initialize())
// app.use(passport.session())
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

/*
if(cluster.isPrimary) {
    console.log("Soy el proceso principal");
    for(let i= 0; i < cpus().length; i++) {
        cluster.fork()
    }
    app.listen(PORT, () => {
        console.log(`Server on port ${PORT}`);
    })
} else {
    console.log("Soy un worker");
    app.listen(5000, () => {
        console.log(`Server on port ${5000}`);
    })
}*/
