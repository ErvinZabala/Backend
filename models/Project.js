import mongoose from 'mongoose';


const projectSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: false
    },
    fechaInicio: {
        type: Date,
        required: false
    },
    fechaFin: {
        type: Date,
        required: false
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Hace referencia al modelo `User`
        required: true
    }
});


export default mongoose.model('Project', projectSchema); 