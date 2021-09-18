/* eslint-disable import/no-anonymous-default-export */

import React from 'react'
import './Wrapper.css'
import '../../baseStyles.css'
import LanguageOptions from './componentsWrapper/LanguageOptions'

export default ( {toggleWrapper, changeText} )=>{

    // if(!hidden){
        return(
            <div className='wrapper'>
                <div className='translation-options-area'>
                    <div className='translation-option'>
                        Traduzir para:
                        <br/>
                        <select className='select-lang translateTo'>
                            {/* <option value='en'>Inglês</option>
                            <option value='pt' selected>Português</option> */}
                            <LanguageOptions />
                        </select>
                    </div>
                    <div className='translation-option'>
                        Texto em: 
                        <br/>
                        <select className='select-lang translateFrom'>
                            {/* <option value='en'>Inglês</option>
                            <option value='pt'>Português</option> */}
                             <LanguageOptions automaticOption={true}/>
                        </select>
                    </div>
                    
                </div> 
                <textarea className='textarea-wrapper'/>
                <div className='wrapper-btns'>
                    <div className='wrapper-btn' onClick={changeText}>Confirmar</div>
                    <div className='wrapper-btn' onClick={toggleWrapper}>Sair</div>
                </div>
            </div>
        )
    // }else{
    //     return(<div/>)
    // }
}