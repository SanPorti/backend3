/*{
    fatal: 0, //Rojo oscuro
    error: 1, //Naranja
    warning: 2, //Amarillo
    info: 3, //Verde
    http: 4,
    debug: 5 //Azul
}*/

import winston from "winston";

const levelsOpt = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'white'
    }
}

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: "error",
            filename: './errors.log',
            format: winston.format.simple()
        }),
        new winston.transports.File({
            level: "info",
            filename: './src/log/info.log',
            format: winston.format.simple()
        }),
        new winston.transports.File({
            level: "warning",
            filename: './src/log/warning.log',
            format: winston.format.simple()
            
        }),
        new winston.transports.Console({
            level: "http",
            format: winston.format.combine(
                winston.format.colorize({colors:levelsOpt.colors}),
                winston.format.simple()
            )
        }),

    ]
})

export const addLogger = (req,res,next) => {
    req.logger = logger
    req.logger.http(`${req.method} en la ruta ${req.url} -- ${new Date().toLocaleTimeString()}`)
    next()
}