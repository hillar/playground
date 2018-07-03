
function escapeRegExp(needle) {
  return needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function linebreaks(text){
  return text.replace(new RegExp('\n\n','g'),'<p>').replace(new RegExp('\n','g'),'<br>')
}

function highlight(o) {
  if (!o.content) return ''
  let t = o.content.join('\n\n')
  for (const key of Object.keys(o)){
   if (key !== 'content' && key !== 'id'){
     for (const hl of o[key]){
       t = t.replace(new RegExp(escapeRegExp(hl), 'g'),'<span class="field" draggable="true" ondragstart="dragstart_handler(event)">'+hl+'<span class="tooltip"> '+key+' </span></span>')
     }
   }
  }
  return linebreaks(t)
}

function findKeyByValue(o,value){
  for (const key of Object.keys(o)){
   if (key !== 'content' && key !== 'id'){
     for (const hl of o[key]){
       if (hl === value) {
         return key
       }
     }
   }
  }
  return
}


export function annotate(e,o) {
    const userobjects = []
    const parent = document.createElement("div")
    const text = document.createElement("div")
    // TODO something else than innerHTML
    text.innerHTML = highlight(o)

    const save = document.createElement('button')
    save.innerHTML = 'save';
    save.onclick = function(){
      delete(o.content)
      parent.innerHTML = '<pre>'+JSON.stringify(o,null,2)+JSON.stringify(userobjects,null,2)+'</pre>'
      return false
    }
    const drops = document.createElement('div')
    const adddrops = document.createElement('button')
    adddrops.innerHTML = 'add new object';
    adddrops.onclick = function(){
      const id = userobjects.length
      userobjects.push([])
      const holder = document.createElement('span')
      holder.className = 'holder'
      holder.addEventListener('dragenter',() => { holder.className += " hovered" }, false)
      holder.addEventListener('dragover',(event) => { event.preventDefault(); }, false)
      holder.addEventListener('dragleave',() => { holder.className = "holder" }, false)
      holder.addEventListener('drop',(event) => {
        event.preventDefault();
        const value = dragged.childNodes[0].data
        const key = dragged.childNodes[1].childNodes[0].data.trim()
        console.log(key,value)
        const tmp = {}
        tmp[key] = value
        userobjects[id].push(tmp)
        const li = document.createElement('li')
        li.innerText = id+' : '+key+' : '+value
        holder.appendChild(li)
      }, false)
      drops.appendChild(holder)
      return false
    }



    parent.appendChild(text)
    parent.appendChild(drops)
    parent.appendChild(adddrops)
    parent.appendChild(save)
    e.appendChild(parent)

    function getSelectionString(e) {
      console.log('getSelectionString',e)
      const selection = document.getSelection()
      const value = selection.toString().trim()
      if (value !== '' ) {
          if (e.altKey) {
            const todel = findKeyByValue(o,value)
            if (todel) {
              // ask user
              const del = confirm(todel+':'+value+'<- remove that ..')
              if (del){
                if (o[todel])  {
                  delete(o[todel])
                  text.innerHTML = highlight(o)
                }
              }
            }
          } else {
            // ask user
            const key = prompt(value +" <- What is that?",findKeyByValue(o,value))
            if (key && key.trim() !== '') {
              let overwrite = true
              // ask user
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
