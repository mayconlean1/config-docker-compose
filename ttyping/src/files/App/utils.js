/* eslint-disable import/no-anonymous-default-export */

const LOCAL = process.env.LOCAL || 'localhost'

let cursor = 0
let currentChar = ''

const translateInTextarea = initDebounce()
const translatedOptions = initTranslateOptions()
const handleSpanPosition = inithandleSpanPosition()

const handleTimeController = initTimeController()
const eficiencyController = initEficiencyController()

const utils = {
  changeStringToArray(refText = ''){
      const arrayRefText =[]
      for(let char of refText){
          arrayRefText.push(char)
      }
      return arrayRefText
  },
  
  createSpan(char='' , index=''){
      const id = `char_${index}`
      return (<span id={id} className='span-char'>{char}</span>)
  },
  
  async updateInput(handleBool){
    
    const hiddenTextarea =document.querySelector('#typing-textarea')
    const baseTextarea = document.querySelector('.base-textarea')

    try{
      
      const spanChar = document.querySelector(`#char_${cursor}`)
      spanChar.classList.remove('bg-green')
      spanChar.classList.remove('bg-red')
      spanChar.classList.remove('bg-grey')

      cursor = hiddenTextarea.value.length === -1 ? 0 : hiddenTextarea.value.length 
      let currentHiddenChar = hiddenTextarea.value[hiddenTextarea.value.length -1] 
      
      if(currentChar === currentHiddenChar){
        
        spanChar.classList.add('bg-green')

      }else{

        spanChar.classList.add('bg-red')

      }
      currentChar = baseTextarea.textContent[cursor]

      const nextSpanChar = document.querySelector(`#char_${cursor+1}`)
      if(nextSpanChar !== null){
        nextSpanChar.classList.remove('bg-green')
        nextSpanChar.classList.remove('bg-red')
        nextSpanChar.classList.remove('bg-grey')
      }

      if(cursor-1 !== 0){
        const prevSpanChar = document.querySelector(`#char_${cursor-1}`)
        
        if (prevSpanChar !== null){
          prevSpanChar.classList.remove('bg-grey')
        }
      }
      const currentSpanChar = document.querySelector(`#char_${cursor}`)
      currentSpanChar.classList.add('bg-grey')

      moveScrollBaseTextArea()
    }catch{
      
      toggleCheckbox(handleBool, true)

      utils.timeController.end()
      
      const [stringTime, typeTime] = utils.timeController.format()
      const truncStringTime = stringTime.slice(0,stringTime.length-2)
      
      const divTime = document.querySelector('.time-area')
      divTime.innerHTML = `Tempo <strong>${truncStringTime}</strong> (${typeTime}) <br/>
      Média palavras por minuto  <strong>${utils.timeController.wordsPerMinute()}</strong> <br/>
      Eficiência <strong>${eficiencyController.result()} %</strong>`
      // divTime.innerHTML = `Finalizado em ${(utils.timeController.totalTime()/1000).toFixed(1)} segundos <br/>
      // Média palavras por minuto  ${utils.timeController.wordsPerMinute()} <br/>
      // Eficiência ${eficiencyController.result()} %`
      // alert(`Finalizado em ${(utils.timeController.totalTime()/1000).toFixed(1)} segundos`)
    }
    const translateConf = {...translatedOptions.get(), text: hiddenTextarea.value}

    // console.log(translateConf)
    await translateInTextarea(translateConf, 
      // translateInTextarea
      )
  },

  resetTextCursor(handleBool){

    resetCursor()
    clearHiddenTextarea()
    resetCursorColors()
    toggleCheckbox(handleBool)

    function resetCursor(){
      cursor = 0
      currentChar = ''
    }

    function clearHiddenTextarea(){
      const hiddenTextarea = document.querySelector('#typing-textarea')
      hiddenTextarea.value = ''
    }

    function resetCursorColors(){
      const spans = document.querySelectorAll('span')
      spans.forEach(span=>{
      span.classList.remove('bg-green')
      span.classList.remove('bg-red')
      span.classList.remove('bg-grey')
    })
    }
  },

  setTranslateConfig(){

    const indexTo = document.querySelector('.translateTo').selectedIndex
    const valueTo = document.querySelector('.translateTo')[indexTo].value

    const indexFrom = document.querySelector('.translateFrom').selectedIndex
    const valueFrom = document.querySelector('.translateFrom')[indexFrom].value

    // config={'from':'en', 'to':'pt'}
    const config = {'from' : valueFrom, 'to': valueTo}

    translatedOptions.set(config)
  },

  moveScrollTranslateArea(){
    const scrollHeight = document.querySelector('.translate-area').scrollHeight
    document.querySelector('.translate-area').scroll(0,scrollHeight)
  },

  timeController:handleTimeController
  
 
}

function initDebounce( timeout=200 ){

  let processedText
  let currentText
  let time
  let processingTranslation = false

  return async (data = {text:'',from:'en',to:'pt'} )=>{
    currentText = data.text
    clearTimeout(time)

    if(!processingTranslation && processedText !== currentText){
      processedText = currentText
      processingTranslation = true
      
       
      const res =  await fetch(`http://${LOCAL}:8080/`,{
        method: "POST",
        body: JSON.stringify(data),
        headers: { 
            "Content-Type": "application/json",
        },
      })
      const resJson = await res.json()
      const translatedText = resJson.translated_text

      document.querySelector('.translate-area').innerHTML = translatedText
    
      time = setTimeout( async ()=>{
        if(processedText !== currentText){
          const rData = {...data, text: currentText}
          await translateInTextarea(rData)
        }
        
      },timeout)

      processingTranslation = false
      
    }
  }
}

function initTranslateOptions(){
  const option = {
    'from' : 'en',
    'to': 'pt'
  }
  return{
    get(){
      return option
    },
    set(opt={from:'', to: ''}){
      option['from'] = opt['from']
      option['to'] = opt['to']
    }
  }
}

function inithandleSpanPosition(){
  let currentPosition
  let nextPosition
  let pos = 0
 
  return (movePosition)=>{
    if(currentPosition === undefined){

      currentPosition = movePosition
      pos += movePosition

    }else{
      if  (movePosition !== currentPosition   && 
          movePosition !==nextPosition        ){

          pos += movePosition
          currentPosition = pos
      }

      nextPosition = movePosition + pos

    }
    return currentPosition 
  }
}

function moveScrollBaseTextArea(){

  const textareaPosition = document.querySelector('.base-textarea').getBoundingClientRect().top

  const currentSpan = document.getElementById(`char_${cursor}`)
  const spanPosition = currentSpan.getBoundingClientRect().top

  // console.table(
  //   textareaPosition, spanPosition,)
  
  const moveDivScroll = spanPosition - (textareaPosition + 12)
  const controlSpanPosition = handleSpanPosition(moveDivScroll)
  // if(moveDivScroll !== 0 ){
    // controlSpanPosition = handleSpanPosition(moveDivScroll)

  // }

  const textArea = document.querySelector('.base-textarea')

  // console.table(
  //   textareaPosition, spanPosition, moveDivScroll, controlSpanPosition   )
  textArea.scrollTo(
    0, controlSpanPosition
    // {
    //   top: controlSpanPosition ,
    //   left: 0,
    //   behavior: 'smooth'
    // }
  )

}

function toggleCheckbox(handleBool, hiddenCheckboxArea = false){
  
  if(handleBool !== undefined){

    const [,ckboxArea] = handleBool.handleBoolCheckboxArea
    if(hiddenCheckboxArea){
      ckboxArea( true )
    }else{
      ckboxArea( false )
    }

    const [boolCheckbox, setBoolcheckbox] = handleBool.handleBoolCheckbox
    setBoolcheckbox(!boolCheckbox)
  }
}

function initTimeController(){

  let initTime
  let endTime

  return{
    getInitTime(){
      return initTime
    },

    getEndTime(){
      return endTime
    },
    
    reset(){
      initTime = undefined
      endTime = undefined
      const divTime = document.querySelector('.time-area')
      divTime.innerHTML = ''
    },

    start(){
      if(initTime === undefined){
        initTime = Date.now()
      }
    },

    end(){
      if(endTime === undefined){
        endTime = Date.now()
      }
    },
    totalTime(){
      if(initTime !== undefined && endTime !== undefined){
        return endTime - initTime
        // return 16516513203
      }
    },
    wordsPerMinute(){
      if(this.totalTime()){

        const seconds = (this.totalTime() / 1000).toFixed(1)
        const baseTextarea = document.querySelector('.base-textarea').textContent
        const words = baseTextarea.match(/\S+/gi)
        const wordsCount = words.length
        const wpm = Math.round( (wordsCount * 60) / seconds )
        return wpm
      }
    },
    format(type='HMSMS'){
      // const msTotalTime = 10000025
      const msTotalTime = this.totalTime()

      if(type === 'HMSMS' && msTotalTime !== undefined){
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(msTotalTime)

        const mountHours = '000'+ date.getHours()
        const hours = mountHours.substring(mountHours.length -2)
        const mountMinutes = '00' + date.getMinutes()
        const minutes = mountMinutes.substring(mountMinutes.length -2)
        const mountSeconds = '00' + date.getSeconds()
        const seconds = mountSeconds.substring(mountSeconds.length -2)
        const mountMiliseconds = '00' + date.getMilliseconds()
        const miliseconds = mountMiliseconds.substring(mountMiliseconds.length -3)

        const mountTime = `${hours}:${minutes}:${seconds}:${miliseconds}`
        // const mountTime = '00:02:15:00'
        const [stringTime, typeTime] = checkTimeValues(mountTime)

        // console.log(stringTime)
        // return ` ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}` 

        return [stringTime, typeTime]
      }

      function checkTimeValues(mountTime=''){
        let arrayTime = mountTime.split(':')
        let stringTime = '00'
        const typesTime = ['hour', 'minutes', 'seconds' , 'miliseconds']
        let typeTime 
        for(let i in arrayTime){
          const tTime = arrayTime[i]
          // console.log('teste3', tTime, Number (tTime) > 0 , tTime > 0)
          if(tTime > 0){
            stringTime = arrayTime.slice(Number(i))
            typeTime = typesTime[i]
            // console.log('teste', stringTime)
            break
          }
        }
        // console.log('teste1', stringTime ,'teste2', arrayTime)
        return [stringTime.join(':'), typeTime ]
      }
    }

  }
}

function initEficiencyController(){
  let totalCharacters = 0
  function updateTotalCharacters(){
    totalCharacters = document.querySelector('.base-textarea').textContent.length
  }
  function totalCorrectCharacters(){
    return document.querySelectorAll('.bg-green').length
  }
  // function totalIncorrectCharacters(){
  //   return document.querySelectorAll('.bg-red').length
  // }
  return {
    result(){
      updateTotalCharacters()
      return ((totalCorrectCharacters() * 100) / totalCharacters).toFixed(2)
    }
  }
}


export default utils