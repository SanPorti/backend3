import userModel from "../models/user.js"; 

export const uploadFiles = async (req, res) => {
    try {
        const {uid} = req.params

        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ message: "No se enviaron archivos" })
        }

        const newDocs = req.files.map(file => ({
            name: file.originalname,
            reference: file.path       
        }));

        const user = await userModel.findByIdAndUpdate(
            uid,
            { $push: { documents: { $each: newDocs } } },
            { new: true }
        );

        if(!user) 
            res.status(404).send({message: "No existe el usuario"})
        res.status(200).send({message: "Documentos cargados exitosamente"})
    } catch (error) {
        res.status(500).send({message: error})
    }
}
