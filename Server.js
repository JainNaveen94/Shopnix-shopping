const express = require('express')
const {
    db,
    Products,
    Users,
    Vendors,
    Carts,
    Op
} = require('./db')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/',
    express.static(__dirname + '/public')
)

/* User Related Request Are Here */

app.get('/users', async (req, res) => {

    const users = await Users.findAll()
    res.send(users)
})

app.get('/user', async (req, res) => {
    console.log("Hello I m In the Get Of User Under Server.js");
    console.log(req.query.username);
    console.log(req.query.password);
    try {
        const validuser = await Users.findOne({
            where: {
                name: req.query.username,
                password: req.query.password
            }
        })
        if(validuser == null){
            res.send({success: false, message: "User Not Exist"});
        }
        res.send({ success: true, Validuser: validuser });
    } catch (err) {
        res.send({ success: false, err: err.message });
    }
})

app.post('/user', async (req, res) => {

    try {
        const user = await Users.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.send({ success: true })
    } catch (err) {
        res.send({ success: false, err: err.message })
    }
})

app.delete('/user/:id', async (req, res) => {
    let userid = req.params.id;
    try {
        const user = Users.destroy({
            where: {
                id: userid
            }
        })
        res.send({ success: true })
    } catch (err) {
        res.send({ success: false, err: err.message })
    }
})

/* Product related Request Are Here */

app.get('/product', async (req, res) => {

    const products = await Products.findAll({
        include: [
            Vendors
        ]
    }
    )
    res.send(products)
})

app.post('/product', async (req, res) => {

    try {
        const product = await Products.create({
            name: req.body.product_name,
            quantity: req.body.quantity,
            price: req.body.price,
        })
        const vendor = await Vendors.findOne({
            where:{
                id:parseInt(req.body.vendor_id)
            }
        })
        vendor.addProducts(product)
        res.send({ success: true })
    } catch (err) {
        res.send({ success: false, err: err.message })
    }

})

app.delete('/product/:id', async (req, res) => {

    let productid = req.params.id

    try {
        const prodo = await Products.destroy({
            where: {
                id: productid
            }
        })
        res.send({ success: true })
    } catch (err) {
        res.send({ success: false, err: err.message })
    }

})

/* Vendor Related Request Are Here */

app.get('/vendor', async (req, res) => {

    const vendo = await Vendors.findAll()
    res.send(vendo)
})

app.post('/vendor', async (req, res) => {
    console.log("I am Adding Vendor ");

    try {
        const vendo = await Vendors.create({
            name: req.body.name,
            address: req.body.address,
        })
        res.send({ success: true })
    } catch (err) {
        console.error(err)
        res.send({ success: false, err: err.message })
    }

})

app.delete('/vendor/:id', async (req, res) => {
    console.log("I am In the Deleting Vendor")

    let vendoid = req.params.id;
    try {
        // const prodo = await Products.destroy({
        //     where: {
        //         vendorId: vendoid
        //     }
        // })
        const vendo = await Vendors.destroy({
            where: {
                id: vendoid
            }        })
        res.send({ success: true })
    } catch (err) {
        console.error(err)
        res.send({ success: false, err: err.message })
    }

})



/* Cart Related Requests Are Here */


app.get('/cart/:id', async (req, res) => {
    let user_id = req.params.id;

    const Items = await Carts.findAll({
        where : {
            userId: user_id
        },
        include: [
            Products
        ]
    })

    res.send(Items);
})

app.post('/cart', async (req, res) => {
    //console.log("I am Adding Item To Cart Bro!! Server");
    let U_id = req.body.userid;
    let P_id = req.body.prodid;

    try {
        const avilableProduct = await Carts.findOne({
            where: {
                userId: U_id,
                productId: P_id
            }
        })
        if (avilableProduct == null) {
            const addToCart = await Carts.create({
                quantity: 1,
                // productId: P_id,
                // userId: U_id
            })
            const addProduct = await Products.findOne({
                where:{
                    id:parseInt(P_id)
                }
            })
            const addUser = await Users.findOne({
                where:{
                    id:parseInt(U_id)
                }
            })
            addProduct.addCarts(addToCart)
            addUser.addCarts(addToCart)
            res.send({success: true, msg: 'Added Product To Cart Sucessfully'})
        } else {
            let qty = avilableProduct.quantity + 1;
            const updateProductInCart = await Carts.update(
                { quantity: qty },
                {
                    where: {
                        productId: P_id,
                        userId: U_id
                    }
                }
            )
            res.send({ success: true, msg: 'Quantity Has Being Increased' });
        }
    } catch (err) {
        console.log(err);
        res.send({ success: false, err: err.message });
    }
})

app.delete('/cart/:id', async (req, res) => {
    let deleteCartItemid = req.params.id;

    try{
        const deleteItem = await Carts.destroy({
            where : {
                id: deleteCartItemid
            }
        })
        res.send({success: true});
    } catch (err){
        res.send( {success: false, err: err.message});
    }
})

app.delete('/carts/:id', async (req, res) => {
    let deleteUserid = req.params.id;

    try{
        const checkout = await Carts.destroy({
            where : {
                userId: deleteUserid
            }
        })
        res.send({success: true});
    } catch (err) {
        res.send({success : false, err: err.message })
    }
})


const PORT = process.env.PORT || 9999

db.sync()
    .then(() => {
        app.listen(PORT)
    })



