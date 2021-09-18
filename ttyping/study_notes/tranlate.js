

async function translateString(str, translateTo){
    // translate.engine = 'libre';
    // const translated_string = await translate(str , translateTo)
    // console.log(translated_string)

    const res = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        body: JSON.stringify({
            q: str,
            source: "pt",
            target: translateTo
        }),
        headers: { "Content-Type": "application/json" }
    });
    console.log(await res.json())
    return res


}

translateString('Hello' , 'es')
