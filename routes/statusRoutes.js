// Backend/routes/statusRoutes.js
import express from 'express';

const router = express.Router();

// Ruta para verificar el estado del backend
router.get('/status', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

export default router;
