import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import auth from '../middleware/authMiddleware.js';

import mongoose from 'mongoose';


const router = express.Router();

// Crear una tarea en un proyecto específico
router.post('/:proyectoId/tareas', auth, async (req, res) => {
    console.log('Proyecto ID:', req.params.proyectoId);
    console.log('Datos de la Tarea:', req.body);

    try {
        const project = await Project.findById(req.params.proyectoId);
        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        if (project.usuario.toString() !== req.user) {
            return res.status(403).json({ msg: 'No tienes permiso para agregar tareas a este proyecto' });
        }

        const newTask = new Task({
            proyecto: req.params.proyectoId,
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            estado: req.body.estado || 'pendiente',
            prioridad: req.body.prioridad || 'media',
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error al crear tarea:', error.message);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});



// Obtener todas las tareas de un proyecto específico
router.get('/:proyectoId/tareas', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.proyectoId);
        if (!project || project.usuario.toString() !== req.user) {
            return res.status(404).json({ msg: 'Proyecto no encontrado o acceso no autorizado' });
        }

        const tasks = await Task.find({ proyecto: req.params.proyectoId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las tareas' });
    }
});

// Actualizar una tarea específica en un proyecto
router.put('/:proyectoId/tareas/:taskId', auth, async (req, res) => {
    const { proyectoId, taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(proyectoId) || !mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ msg: 'ID de proyecto o tarea no válido' });
    }

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        if (task.proyecto.toString() !== proyectoId) {
            return res.status(404).json({ msg: 'La tarea no pertenece a este proyecto' });
        }

        const project = await Project.findById(proyectoId);
        if (!project || project.usuario.toString() !== req.user) {
            return res.status(403).json({ msg: 'No autorizado' });
        }

        const { titulo, descripcion, estado, prioridad } = req.body;
        task.titulo = titulo || task.titulo;
        task.descripcion = descripcion || task.descripcion;
        task.estado = estado || task.estado;
        task.prioridad = prioridad || task.prioridad;

        await task.save();
        res.json(task);
    } catch (error) {
        console.error('Error al actualizar la tarea:', error.message);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
});


// Eliminar una tarea de un proyecto específico
router.delete('/:proyectoId/tareas/:taskId', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        if (task.proyecto.toString() !== req.params.proyectoId) {
            return res.status(404).json({ msg: 'Tarea no pertenece a este proyecto' });
        }

        const project = await Project.findById(req.params.proyectoId);
        if (!project || project.usuario.toString() !== req.user) {
            return res.status(403).json({ msg: 'Acceso no autorizado' });
        }

        await task.deleteOne();
        res.json({ msg: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la tarea' });
    }
});
export default router;