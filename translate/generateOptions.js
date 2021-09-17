
const langs = require('./suportedLang')

let optionsTag = ''

for(let value in langs){
    const language = langs[value]
    optionsTag += `<option value='${value}'>${language}</option>\n`
}

console.log(optionsTag)