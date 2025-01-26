import {Router} from 'express';
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/tasks.controllers.js';
import {authRequired} from '../middlewares/validateToken.js'

const router = Router();

router.get('/tasks', authRequired, getTasks)

router.get('/task/:id', authRequired, getTask)

router.post('/tasks', authRequired, createTask)

router.put('/task/:id', authRequired, updateTask)

router.delete('/task/:id', authRequired, deleteTask)

export default router;