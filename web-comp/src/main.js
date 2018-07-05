import { dummy } from './dummy.js'

console.log('main',dummy())

// check customElements
if (window.customElements) {
  console.log('customElements ok')
  // check HTML Imports
  if ('import' in document.createElement('link')){
    console.log('import HTML ok')
  } else {
    document.body.innerHTML='<h1>import HTML is not supported ;(</h1>'
    // https://developer.mozilla.org/en-US/docs/Web/Web_Components/HTML_Imports
    // Firefox will not ship HTML Imports
  }
} else {
  document.body.innerHTML='<h1>customElements is not supported ;(</h1>'
}

class EditableList extends HTMLElement {
     constructor() {
         super();
         const shadow = this.attachShadow({ mode: 'open' });
         this.objects = []
         const title = this.title;
         const listItems = this.items;
         const editableListContainer = document.createElement('div');
         editableListContainer.classList.add('editable-list');
         editableListContainer.innerHTML = `
             <style>
                 li, div > div {
                   display: flex;
                   //align-items: center;
                   //justify-content: space-between;
                 }
                 .icon {
                     background-color: #fff;
                     border: none;
                     cursor: pointer;
                     float: left;
                     font-size: 1rem;
                 }
                 .hovered {
                   border: dotted 2px green;
                 }
             </style>
             <h3>${title}</h3>
             <ul class="item-list">
                 ${listItems.map(item => `
                     <li>
                         <button class="editable-list-remove-item icon">&ominus;</button>
                         ${item}
                     </li>
                 `).join('')}
             </ul>

         `;
         this.handleRemoveItemListeners = this.handleRemoveItemListeners.bind(this);
         this.removeListItem = this.removeListItem.bind(this);
         shadow.appendChild(editableListContainer);
     }

     connectedCallback() {
         let removeElementButtons = [...this.shadowRoot.querySelectorAll('.editable-list-remove-item')];
         this.itemList = this.shadowRoot.querySelector('.item-list');
         this.handleRemoveItemListeners(removeElementButtons);
     }

     get title() { return this.getAttribute('title') || ''; }

     get items() {
         const items = [];
         [...this.attributes].forEach(attr => {
             if (attr.name.includes('list-item')) {
                 items.push(attr.value);
             }
         });
         return items;
     }

     get addItemText() {
         return this.getAttribute('add-item-text') || '';
     }

     handleRemoveItemListeners(arrayOfElements) {
         arrayOfElements.forEach(element => element.addEventListener('click', this.removeListItem, false));
     }

     removeListItem(e) { e.target.parentNode.remove(); }

     doDrop(element){
       if (! element.name) return
       if (this.objects.includes(element.name)) return
       this.objects.push(element.name)
       console.log('ondrop',element._name)
       const li = document.createElement('li');
       const button = document.createElement('button');
       const childrenLength = this.itemList.children.length;
       li.textContent = element._name;
       button.classList.add('editable-list-remove-item', 'icon');
       button.textContent = '\u2796';
       this.itemList.appendChild(li);
       this.itemList.children[childrenLength].appendChild(button);
       this.handleRemoveItemListeners([...this.itemList.children]);
     }
 }

 // let the browser know about the custom element
customElements.define('editable-list', EditableList);
