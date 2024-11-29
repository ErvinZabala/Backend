// Después (con import):
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Ruta de registro de usuario
router.post('/register', async (req, res) => {
    const { nombre, email, password } = req.body;
  
    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }
  
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'El usuario ya existe' });
      }
  
      user = new User({ nombre, email, password });
      await user.save();
  
      res.status(201).json({ msg: 'Usuario registrado con éxito' });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ msg: 'Error en el servidor' });
    }
  });
  

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('¿La contraseña coincide?:', isMatch);


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        

        res.json({ token });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

export default router;