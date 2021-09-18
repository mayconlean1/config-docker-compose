const express = require('express')
const app = express()
const translate = require('@vitalets/google-translate-api')
const cors = require('cors')

app.use(express.urlencoded({extended:true})) 
app.use(express.json())

app.use((req, res, next)=>{ //config CORS
    //Access-Control-Max-Age
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods',  'POST');
    
    if (res.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    app.use(cors())
    next ();
})

app.post('/', async (req,res)=>{
    
    const data = {
        text : req.body.text || 'Field of translating',
        // from : req.body.from === undefined ? 'en' :  req.body.from,

        to: req.body.to === undefined ? 'pt' :  req.body.to,
    }
    

    const translated = await translate(data.text, { from: data.from, to: data.to })
    const text = translated.text
    
    return res.send({translated_text: text})
})

module.exports = app