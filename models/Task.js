import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    estado: {
        type: String,
        enum: ['pendiente', 'en_progreso', 'completada'],
        default: 'pendiente'
    },
    prioridad: {
        type: String,
        enum: ['alta', 'media', 'baja'],
        default: 'media'
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Task', taskSchema);
