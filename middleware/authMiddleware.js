import jwt from 'jsonwebtoken'; /* la biblioteca que permite trabajar con tokens JWT, que incluyen funciones para crear, verificar y decodificar tokens. */

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token recibido:', token); // Verifica el token aquí
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        console.log('ID del usuario autenticado:', req.user);
        next();
    } catch (error) {
        console.error('Error de validación del token:', error.message);
        res.status(401).json({ msg: 'Token no es válido' });
    }
};
export default auth;