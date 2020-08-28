const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    async findAll() {
        try {
            const results = await db.query(`
                SELECT ${this.table}.*, count(recipes) AS total_recipes
                FROM ${this.table}
                LEFT JOIN recipes ON (${this.table}.id = recipes.chef_id)
                GROUP BY ${this.table}.id
                ORDER BY total_recipes DESC
            `)

            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async chefRecipes(id) {
        try {
            const results = await db.query(`
                SELECT recipes.*
                FROM recipes
                WHERE chef_id = $1
                ORDER BY created_at DESC
            `, [id])

            return results.rows
        } catch (error) {
            console.error(error)
        }
    }
}