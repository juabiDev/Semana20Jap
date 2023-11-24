import express, { json } from 'express';
import { userRoutes } from './src/routes/user.routes.js'
import cors from 'cors';

const app = express();

const PORT = process.env.PORT ?? 3000;

app.use(json());
app.use(cors());
app.use("/", userRoutes);

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
