
const refText = `It seems like the world is growing more and more interested in Juliette Freire, an anonymous woman who has been gaining lots of attention.`
function changeStringToArray(refText = ''){
    const arrayRefText =[]
    for(let char of refText){
        arrayRefText.push(char)
    }
    return arrayRefText
}

const array = changeStringToArray(refText)
console.log(array[0])

