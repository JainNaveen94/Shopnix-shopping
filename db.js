const Sequelize = require('sequelize')
const Op = Sequelize.Op

/* Creating DataBase EKart For Storage */
const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/ekart.db'
})

/* Creating Tables Inside The DataBase ekart */

const Users = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const Products = db.define('product', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 5
    },
    price: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    }
})

const Vendors = db.define('vendor', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const Carts = db.define('cart', {
    quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    }
})


/* Defining Relationship Between Tables */


// Define Relationship Between User and cart
Users.hasMany(Carts, { onDelete: 'cascade' })            // will add the user id to cart
Carts.belongsTo(Users)          // will add the user id to cart

// Define Relationship Between Vendor and Product
Vendors.hasMany(Products, { onDelete: 'cascade' });      // will add vendor id to product
Products.belongsTo(Vendors);    // will add vendor id to product

// Define Relationship Between Cart And Product
Products.hasMany(Carts, {onDelete: 'cascade'})         // will add the Product id to cart
Carts.belongsTo(Products)       // will add the Product id to cart

/* Exporting Database Table To Server */

module.exports = {
    db, Products, Users, Vendors, Carts, Op
}