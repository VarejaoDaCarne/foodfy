const db = require('../../config/db')
const { hash } = require('bcryptjs')

const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base
}