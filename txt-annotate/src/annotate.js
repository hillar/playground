
function escapeRegExp(needle) {
  return needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function linebreaks(text){
  return text.replace(new RegExp('\n\n','g'),'<p>').replace(new RegExp('\n','g'),'<br>')
}

function highlight(o) {
  let t = o.content
  for (const key of Object.keys(o)){
   if (key !== 'content'){
     for (const hl of o[key]){
       t = t.replace(new RegExp(escapeRegExp(hl), 'g'),'<b><i>'+hl+'</i></b>')
     }
   }
  }
  return linebreaks(t)
}

function findKeyByValue(o,value){
  for (const key of Object.keys(o)){
   if (key !== 'content'){
     for (const hl of o[key]){
       if (hl === value) {
         return key
       }
     }
   }
  }
  console.log('did not found', value)
  return
}


export function annotate(e,o) {

    const parent = document.createElement("div")
    const text = document.createElement("div")
    // TODO something else than innerHTML
    text.innerHTML = highlight(o)

    const button = document.createElement('button');
    button.innerHTML = 'save';
    button.onclick = function(){
      alert(JSON.stringify(o,null,2))
      return false
    }
    parent.appendChild(text)
    parent.appendChild(button)
    e.appendChild(parent)

    function getSelectionString(e) {

      const selection = document.getSelection()
      const value = selection.toString().trim()
      if (value !== '' ) {
          if (e.altKey) {
            const todel = findKeyByValue(o,value)
            if (todel) {
              const del = confirm(todel+':'+value+'<- remove that ..')
              if (del){
                if (o[todel])  {
                  delete(o[todel])
                  text.innerHTML = highlight(o)
                }
              }
            }
          } else {
            const key = prompt(value +" <- What is that?",findKeyByValue(o,value))
            if (key && key.trim() !== '') {
              let overwrite = true
              if ( o[key] )  overwrite = confirm(o[key]+' :: overwrite ?')
              if (overwrite) o[key] = [value]
              console.log('added',key,value)
              text.innerHTML = highlight(o)
            }
          }
        }
    }

    text.onmouseup = getSelectionString

}

export function userSelection(o){

}
