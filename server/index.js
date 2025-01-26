import express from 'express';
import { PORT } from './config.js';
import indexRoutes from './routes/index.routes.js';
import taskRoutes from './routes/tasks.routes.js'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
/* Antes de que las peticiones lleguen a las rutas las vamos a procesar, pasandolas por una funcion de express llamada json,
 permite procesar los datos que vengan del cliente y si es un json lo va a permitir recivir en el req.body */
app.use(express.json())
app.use('/api',authRoutes);
app.use('/api',taskRoutes);

app.use(indexRoutes);

app.listen(PORT);

console.log(`Server is running on port ${PORT}`);