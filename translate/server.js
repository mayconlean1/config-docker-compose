const app = require('./app')
const port = process.env.PORT || 8081
// const host = '0.0.0.0'

// app.listen(port, ()=>console.log(`Server up in port ${port}`))
app.listen(port, ()=>{
    console.log(`Tranlate server up in port ${port}, *localhost 8081`)
})
