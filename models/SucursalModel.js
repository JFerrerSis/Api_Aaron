// models/SucursalModel.js (AJUSTADO PARA DIAGNÓSTICO DE CONEXIÓN)
const db = require('../config'); // Asume que db es el Pool de conexión a PostgreSQL

class SucursalModel {
    
    /**
     * Obtiene la lista completa de sucursales.
     */
    static async getAll() {
        const sql = `
            SELECT 
                cod_suc, 
                name_suc, 
                rif_suc 
            FROM 
                sucursales
            ORDER BY 
                cod_suc ASC;
        `;
        try {
            const result = await db.query(sql);
            const sucursalesArray = result.rows; 

            return { sucursales: sucursalesArray };
            
        } catch (error) {
            console.error('Error al obtener sucursales:', error);
            // ¡AJUSTE CLAVE! Lanza el objeto de error original de PostgreSQL.
            throw error; 
        }
    }

    /**
     * Inserta una nueva sucursal en la base de datos.
     */
    static async create(sucursalData) {
        const { cod_suc, name_suc, rif_suc } = sucursalData;

        const sql = `
            INSERT INTO sucursales (cod_suc, name_suc, rif_suc)
            VALUES ($1, $2, $3)
            RETURNING cod_suc, name_suc, rif_suc;
        `;
        const values = [cod_suc, name_suc, rif_suc];

        try {
            const result = await db.query(sql, values);
            return result.rows[0]; 
        } catch (error) {
            console.error('Error al crear una nueva sucursal:', error);
            // ¡AJUSTE CLAVE! Lanza el objeto de error original de PostgreSQL.
            throw error; 
        }
    }
}

module.exports = SucursalModel;