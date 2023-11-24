import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.models.js';
import fs from 'node:fs';


export class UserController {

    // Middleware de autenticación
    static async authenticate(req, res, next) {
        // Verifica si el token está presente en la solicitud
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
        }

        // Verifica y decodifica el token
        jwt.verify(token, "midudev", (err, decoded) => {

            if (err) {
                return res.status(401).json({ message: 'Token inválido.' });
            }

            req.user = decoded; // Agrega los datos del usuario decodificado al objeto de solicitud
            next(); // Permite que la solicitud continúe si la autenticación es exitosa
        });
    }

    static async authenticateUser(req, res) {
        const { email, password } = req.body;

        if(!email || !password) return res.status(400).json({ message: 'Credenciales inválidas.' });

        const user = await UserModel.login(email, password);
    
        if (user.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        } 
    
        // Genera el token
        const token = jwt.sign({ id: user.id, email: user.name  }, "midudev", { expiresIn: '1h' });
    
        // Devuelve el token
        res.status(200).json({ token, email: user.email });
    } 

    static async createUser(req, res) {
        const { email, password } = req.body;

        if(!email || !password) return res.status(400).json({ message: 'Credenciales inválidas.' });

        const user = await UserModel.createUser(email, password);
        
        if (!user) {
            return res.status(401).json({ message: 'Usuario ya existente' });
        }

        return res.status(200).json({ message: 'Usuario creado correctamente.' });

    }

    static async submitProject(req, res) {

        try {
            const { email, title, deploy, repo, description } = req.body;

            if(!email || !description || !repo || !deploy || !title) return res.status(400).json({ message: 'Datos inválidos.' });
            
            await UserModel.submitProject(email, title, deploy, repo, description);
             
            const file = req.file;
            
            const newPath = `./images/${email}-${file.originalname}`;
            fs.renameSync(file.path, newPath);

              res.status(200).json({ message: "Imagen subida" });
        } catch (error) {
              res.status(400).json({ message: "Error al subir Imagen" });
        }
      
    }
}

