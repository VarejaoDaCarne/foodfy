const db = require('../../config/db')
const { unlinkSync } = require('fs')

const Base = require('./Base')

Base.init({ table: 'files' })

module.exports = {
    ...Base,
    async chef(id) {
        try {
            const results = await db.query(`
                SELECT ${this.table}.*
                FROM ${this.table}
                LEFT JOIN chefs ON (${this.table}.id = chefs.file_id)
                WHERE chefs.id = $1
            `, [id])
            
            return results.rows
        } catch (error) {
            console.error(error)            
        }
    },
    async chefDelete(id) {
        try {
            let results = await db.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id])
            const file = results.rows[0]
            unlinkSync(file.path)

            return db.query(`
                DELETE FROM ${this.table} WHERE id = $1
            `, [id])
        }catch(err) {
            console.error(err)
        }
    }
}