// models/ExistenciasModel.js (AJUSTADO PARA DIAGNÓSTICO DE CONEXIÓN)
const db = require('../config'); // Asume que db es el Pool de conexión a PostgreSQL

class ExistenciasModel {
    
    /**
     * Obtiene todas las existencias registradas en todas las sucursales.
     */
    static async getAll() {
        const sql = `
            SELECT 
                maestro, 
                descripcion, 
                cod_suc, 
                existencia
            FROM 
                existencias
            ORDER BY 
                existencia ASC, maestro, cod_suc;
        `;
        try {
            const result = await db.query(sql);
            return { existencias: result.rows }; 
        } catch (error) {
            console.error('Error al obtener todas las existencias:', error);
            // ¡AJUSTE CLAVE! Lanza el objeto de error original de PostgreSQL.
            throw error; 
        }
    }

    /**
     * Busca las existencias de un producto específico por su código 'maestro'.
     */
    static async getByMaestro(maestro) {
        const sql = `
            SELECT 
                e.maestro, 
                e.descripcion, 
                e.cod_suc, 
                e.existencia 
            FROM 
                existencias e
            WHERE 
                e.maestro = $1
            ORDER BY 
                e.existencia ASC;
        `;
        const values = [maestro];

        try {
            const result = await db.query(sql, values);
            return { existencias: result.rows };
        } catch (error) {
            console.error(`Error al buscar existencias para el código maestro ${maestro}:`, error);
            // ¡AJUSTE CLAVE! Lanza el objeto de error original de PostgreSQL.
            throw error;
        }
    }
    
    /**
     * Obtiene todas las existencias (todos los productos) para una sucursal específica.
     */
    static async getBySucursal(codSuc) {
        const sql = `
            SELECT 
                e.maestro, 
                e.descripcion, 
                e.cod_suc, 
                e.existencia 
            FROM 
                existencias e
            WHERE 
                e.cod_suc = $1
            ORDER BY 
                e.existencia ASC;
        `;
        const values = [codSuc]; 

        try {
            const result = await db.query(sql, values);
            return { existencias: result.rows };
        } catch (error) {
            console.error(`Error al buscar existencias por sucursal ${codSuc}:`, error);
            // ¡AJUSTE CLAVE! Lanza el objeto de error original de PostgreSQL.
            throw error;
        }
    }
}

module.exports = ExistenciasModel;