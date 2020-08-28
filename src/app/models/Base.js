const db = require('../../config/db')

async function find(filters, table) {
    try {
        let query = `SELECT * FROM ${table}`

        if(filters) {
            Object.keys(filters).map(key => {
                query += ` ${key} `

                Object.keys(filters[key]).map(field => {
                    query += `${field} = '${filters[key] [field]}'`
                })
            })
        }

        return db.query(query)
    } catch (error) {
        console.error(error)
    }
}

const Base = {
    init({ table }) {
        try {
            if(!table) throw new Error('Invalid Params')

            this.table = table
    
            return this
        } catch (error) {
            console.error(error)
        }
    },
    async find(id) {
        try {
            const results = await find({ where: { id } }, this.table)
            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    },
    async findOne(filters) {
        try {
            const results = await find(filters, this.table)
            return results.rows[0]
        } catch (error) {
            console.error(error)
        }
    },
    async findAll(filters) {
        try {
            const results = await find(filters, this.table)
            return results.rows
        } catch (error) {
            console.error(error)
        }
    },
    async create(fields) {
        try {
            let keys = [],
                values = []

            Object.keys(fields).map(key => {
                keys.push(key)

                if (Array.isArray(fields[key])) {
                    values.push(`'{"${fields[key].join('","')}"}'`)
                } else {
                    values.push(`'${fields[key]}'`)
                }
            })

            const query = `
                INSERT INTO ${this.table} ( ${keys.join(',')} ) 
                VALUES (${values.join(',')})
                RETURNING id
            `
            const results = await db.query(query)

            return results.rows[0].id
        } catch (error) {
            console.error(error)
        }
    },
    async update(id, fields) {
        try {
            let values = []

            Object.keys(fields).map(key => {
                if (Array.isArray(fields[key])) {
                    values.push(`${key} = '{"${fields[key].join('","')}"}'`)
                } else {
                    values.push(`${key} = '${fields[key]}'`)
                }
            })

            const query = `
                UPDATE ${this.table} SET 
                ${values.join(',')}
                WHERE id = ${id}
            `

            return db.query(query)
        } catch (error) {
           console.error(error) 
        }
    },
    delete(id) {
        try {
            return db.query(`DELETE FROM ${this.table} WHERE id = ${id}`)
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = Base