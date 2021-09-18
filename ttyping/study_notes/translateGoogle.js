// npm install @vitalets/google-translate-api
const translate = require('@vitalets/google-translate-api');
 
(async ()=>{
  try {
    const res = await translate('I spea portuguese', { from: 'en', to: 'pt' })
    console.log(res.text);    
    console.log(res.from.text.autoCorrected);    
    console.log(res.from.text.value);    
    console.log(res.from.text.didYouMean);
  }
  catch (error){
    console.log(error)
  }
})()

