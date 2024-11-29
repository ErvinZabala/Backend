// Usamos import para todo
import express from 'express';
import cors from 'cors';  // Importa CORS
import connectDB from './config/db.js';  // Conexión a la base de datos
import statusRoutes from './routes/statusRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Inicializa la aplicación de Express
const app = express();

// Conectar a la base de datos
connectDB();

// Configura CORS
app.use(cors());  // Permitir todas las solicitudes de cualquier origen

// Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use('/api', statusRoutes);  // Ruta de estado

// Rutas de autenticación, proyectos y tareas
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', projectRoutes);
app.use('/api/proyectos', taskRoutes);  // Cambié esta línea para que sea '/api/tareas'

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`));
