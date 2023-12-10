import { readFileSync, writeFileSync } from 'fs';
import path from 'path'
import { URL } from 'url'; 
import express from 'express'

const __dirname = new URL('.', import.meta.url).pathname;

// importa el paquete express externo
const app = express() // se crea una instancia de express un enrutador

//Para el servicio de archivos estáticos en una carpeta definida
app.use(express.static('public'));

// activacion de middleware para enviar informacion al servidor
app.use(express.json());
// puerto
const port = 3000;

// Ruta del archivo repertorio.json
const repertorioFilePath = ('repertorio.json');

// Lee el contenido del archivo repertorio.json al iniciar la aplicación
let repertorio = [];
console.log(repertorio);

async function leerRepertorio() {
    try {
      const data = await readFileSync(repertorioFilePath, 'utf-8');
      repertorio = JSON.parse(data);
    } catch (error) {
      console.error('Error al leer repertorio.json:', error.message);
    }
  }

  // Llama a la función para leer el repertorio al iniciar la aplicación
leerRepertorio();
  
// Rutas y configuraciones de tu aplicación
app.get('/canciones', (req, res) => {    
 
    if (repertorio.length === 0) {
        res.status(404).send('No hay datos en Archivo datos.json'); // resp combinada status y send
    } else {
        // Si no está vacío, devuelve el repertorio como JSON
        res.json(repertorio);
    }
  });
  
  // Otras rutas y configuraciones según tus necesidades
  
  // Levanta el servidor
  app.listen(port, () => {
    console.log(`Servidor en puerto: http://localhost:${port}`);
  });

  // Ruta para agregar una nueva canción al JSON

  app.post('/canciones', (req,res) =>{
    try {
        const newSong = req.body;
        const data = JSON.parse(readFileSync(repertorioFilePath, 'utf8'));
        // Agregar la nueva canción al repertorio
        data.push(newSong);         

        // Guardar el repertorio actualizado en el archivo repertorio.json
        writeFileSync(repertorioFilePath, JSON.stringify(data, null, 2), 'utf-8');

        res.json({ mensaje: 'Canción agregada correctamente', cancion: newSong });
    } catch (error) {
        console.error('Error al agregar nueva canción:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
  });