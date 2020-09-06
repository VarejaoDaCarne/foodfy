const db = require('../../config/db')

const Base = require('./Base')
Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    async findAll() {
        try {
            const query = `
                SELECT ${this.table}.*, chefs.name AS chef_name 
                FROM ${this.table}
                LEFT JOIN chefs ON (${this.table}.chef_id = chefs.id)
                ORDER BY created_at DESC
            `

            const results = await db.query(query)

            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async findOne(id) {
        try {
            const results = await db.query(`
                SELECT ${this.table}.*, chefs.name AS chef_name 
                FROM ${this.table}
                LEFT JOIN chefs ON (${this.table}.chef_id = chefs.id)
                WHERE ${this.table}.id = $1
            `, [id])

            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    },
    async paginate(params) {
        try {
            const { filter } = params

            let query = "",
                filterQuery = `WHERE`,
                results
    
            filterQuery = `
                ${filterQuery}
                recipes.title ILIKE '%${filter}%'
            `
    
            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) AS total`
    
            query = `
                SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ${filterQuery}
                ORDER BY updated_at DESC 
            `

            results = await db.query(query)

            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async delete(id) {
        try{
            await db.query(`
                DELETE FROM recipe_files WHERE recipe_id = $1
            `,[id])

            return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
        }catch(err) {
            console.error(err)
        }
    }
}