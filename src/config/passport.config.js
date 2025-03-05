import passport from "passport";
import local from 'passport-local'
import { validatePassword, createHash } from "../utils/bcrypt.js";
import userModel from "../models/user.js";
import jwt from "passport-jwt";
import dotenv from "dotenv"; 

dotenv.config();
const claveSecreta = process.env.CLAVE_SECRETA;

const localStrategy = local.Strategy //Defino la estrategia local

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies.token;
    }
    console.log("token:", token);
    return token; 
}

const initalizatePassport = () => {
    passport.use('register', new localStrategy({passReqToCallback: true, usernameField: 'email'}, async (req,username, password, done) => {
        try {
            const {first_name, last_name, email, password, age} = req.body

            const findUser = await userModel.findOne({email: email})
            
            //Si usuario existe
            if(!findUser) {
                const user = await userModel.create({
                    first_name : first_name,
                    last_name : last_name, 
                    email: email, 
                    password: createHash(password),
                    age: age
                })
                return done(null, user) //Doy aviso de que genere un nuevo usuario
            } else {
                return done(null, false) //No devuelvo error pero no genero un nuevo usuario
            }
    
        }catch (e) {
            console.log(e);
            return done(e)
        }
    }))

    passport.use('login', new localStrategy({usernameField:'email'}, async (username, password, done) => {
        try {
            const user = await userModel.findOne({email: username})
            if(user && validatePassword(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        }catch(e){
            return done(e)
        }

        
    
    }))

    passport.use('jwt', new JWTStrategy ({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: claveSecreta,
    }, async (jwt_payload, done) => {
        try {
            console.log("jwt_payload", jwt_payload);
            return done (null, jwt_payload.user);
            
        } catch (error) {
            return done (error);
        }
    }))

    //Pasos necesarios para trabajar via HTTP
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initalizatePassport