const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const {resolve} = require('path')

app.use('/', express.static(resolve(__dirname , './build')))


app.listen(PORT, (
    console.log(`App server up in port ${PORT}, react_build ${PORT+1}`)
))