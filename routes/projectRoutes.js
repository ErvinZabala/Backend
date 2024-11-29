import express from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Crear un nuevo proyecto
router.post('/', auth, async (req, res) => {
    const { nombre, descripcion, fechaInicio, fechaFin } = req.body;

    try {
        const newProject = new Project({
            usuario: req.user,
            nombre,
            descripcion,
            fechaInicio,
            fechaFin
        });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el proyecto' });
    }
});

// Listar todos los proyectos del usuario autenticado
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({ usuario: req.user });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los proyectos' });
    }
});

// Actualizar un proyecto
router.put('/:id', auth, async (req, res) => {
    const { nombre, descripcion, fechaInicio, fechaFin } = req.body;

    try {
        let project = await Project.findById(req.params.id);
        if (!project || project.usuario.toString() !== req.user) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        project.nombre = nombre || project.nombre;
        project.descripcion = descripcion || project.descripcion;
        project.fechaInicio = fechaInicio || project.fechaInicio;
        project.fechaFin = fechaFin || project.fechaFin;

        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el proyecto' });
    }
});


// Eliminar un proyecto y sus tareas asociadas
router.delete('/:id', auth, async (req, res) => {
    try {
        const projectId = req.params.id.trim(); // Eliminamos espacios en blanco

        console.log('ID del proyecto:', projectId);
        console.log('ID del usuario:', req.user);

        // Buscar el proyecto por ID
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verificar si el usuario autenticado es el propietario del proyecto
        if (!project.usuario.equals(new mongoose.Types.ObjectId(req.user))) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // Eliminar todas las tareas asociadas al proyecto
        await Task.deleteMany({ proyecto: projectId });

        // Eliminar el proyecto
        await project.deleteOne();

        res.json({ msg: 'Proyecto y sus tareas eliminados' });
    } catch (error) {
        console.error('Error al eliminar el proyecto y sus tareas:', error);
        res.status(500).json({ msg: 'Error al eliminar el proyecto y sus tareas', error: error.message });
    }
});
// Obtener un proyecto específico
router.get('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        // Verificar que el proyecto pertenece al usuario autenticado
        if (!project || project.usuario.toString() !== req.user) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        res.json(project);
    } catch (error) {
        console.error('Error al obtener el proyecto:', error.message);
        res.status(500).json({ msg: 'Error al obtener el proyecto' });
    }
});



export default router;