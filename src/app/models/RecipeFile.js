const { unlinkSync } = require('fs')
const db = require('../../config/db')

const Base = require('./Base')
Base.init({ table: 'recipe_files' })

module.exports = {
    ...Base,
    async create({recipe_id,  file_id}) {
        try {
            return db.query(`
                INSERT INTO ${this.table} (
                    recipe_id,
                    file_id
                ) VALUES ($1, $2)
                RETURNING id
            `, [recipe_id, file_id])
        } catch (error) {
            console.error(error)
        }
    },
    async find(id) {
        try {
            const results = await db.query( `
                SELECT files.*
                FROM files 
                LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
                WHERE recipe_files.recipe_id = $1
              `, [id])
        
              return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const files = result.rows

            files.map(file => {
                unlinkSync(file.path)
            })

            await db.query(`
                DELETE FROM ${this.table} WHERE file_id = $1
            `, [id])

            return db.query(`
                DELETE FROM files WHERE id = $1
            `,[id])
        }catch(err) {
            console.error(err)
        }
    },
}