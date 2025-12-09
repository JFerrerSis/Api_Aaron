// config.js (Mejorado con límites de Pool explícitos)

require("dotenv").config(); // Cargar variables de entorno

// 1. IMPORTAR el Pool de conexión del cliente PG
const { Pool } = require('pg');

// 2. CREAR el Pool de conexión con límites definidos
const pool = new Pool({
    // Usar la misma URL de conexión que tienes en tu archivo .env
    connectionString: process.env.DATABASE_URL, 
    
    // --- CONFIGURACIÓN DE ESTABILIDAD AÑADIDA ---
    
    // Máximo de clientes (conexiones) que el pool mantendrá abiertas a la vez.
    // 20 es un buen punto de partida para una API de tráfico moderado.
    max: 20, 
    
    // Tiempo (en milisegundos) que un cliente puede estar inactivo antes de ser cerrado.
    // 30 segundos (30000) ayuda a liberar conexiones que no se usan.
    idleTimeoutMillis: 30000, 
    
    // Tiempo (en milisegundos) que el cliente esperará para establecer una conexión.
    // Si toma más de 5 segundos (5000), fallará rápidamente en lugar de colgarse.
    connectionTimeoutMillis: 5000, 
    
    // Indica si el pool debe intentar reconectar si una conexión falla (por defecto es true)
    // Esto es vital para bases de datos serverless que pueden cerrar conexiones inactivas.
    // application_name: 'AAARON_API_POOL', // Opcional: Nombre para identificar la conexión en la DB
});

// Opcional: Prueba de conexión y registro de la versión 
pool.connect()
    .then(client => {
        console.log('✅ Conexión a PostgreSQL establecida con éxito.');
        client.query('SELECT version()')
            .then(res => console.log('Versión DB:', res.rows[0].version))
            .catch(err => console.error('Error al obtener versión:', err))
            .finally(() => client.release()); // Liberar el cliente después de la prueba
    })
    .catch(err => {
        console.error('❌ Error fatal de conexión a PostgreSQL. Revisa DATABASE_URL:', err.message);
        // Si la conexión inicial falla, la aplicación no debería seguir.
        // process.exit(1); 
    });


// 3. EXPORTAR el Pool de conexión para que los modelos lo usen (const db = pool)
module.exports = pool;