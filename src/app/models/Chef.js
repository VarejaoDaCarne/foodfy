const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'chefs' })

module.exports = {
    ...Base,
    async findAll() {
        try {
            const results = await db.query(`
                SELECT chefs.*, count(recipes) AS total_recipes
                FROM chefs
                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                GROUP BY chefs.id
                ORDER BY total_recipes DESC
            `)

            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async find(id) {
        try {
          const results = await db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
            ORDER BY total_recipes DESC
        `, [id])

            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
      },
    async chefRecipes(id) {
        try {
            const results = await db.query(`
                SELECT recipes.*, chefs.name AS chef_name 
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE chef_id = $1
                ORDER BY created_at DESC
            `, [id])

            return results.rows
        } catch (error) {
            console.error(error)
        }
    }
}