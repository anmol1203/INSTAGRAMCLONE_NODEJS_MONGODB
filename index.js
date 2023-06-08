const express = require ('express')
const app = express ()
require("./model/db")

app.use(express.json())

app.use(require("./controller/auth"))
app.use(require("./controller/post"))
app.use(require("./controller/user"))

const PORT =  3000
app.listen(PORT,()=>console.log(`server is running at ${PORT}`))

