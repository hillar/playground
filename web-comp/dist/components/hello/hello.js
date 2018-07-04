(function () {

  const currentDocument = document.currentScript.ownerDocument

  class Hello extends HTMLElement {

    constructor() {
      super()
      this._name = null
      this.addEventListener('click', e => { this.click(e) })
      this.addEventListener('dragstart', e => { this.drag(e) })
      this.addEventListener('drop', e => { this.drop(e) })
    }

    set name(value) { this._name = value   }

    get name() { return this._name }

    static get observedAttributes() {
      return ['name']
    }

    attributeChangedCallback(attr, oldVal, newVal) {
      const attribute = '_'+attr.toLowerCase()
      if (this[attribute]) this[attribute] = newVal
    }

    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: 'open' })
      const template = currentDocument.querySelector('#hello-template')
      const instance = template.content.cloneNode(true)
      shadowRoot.appendChild(instance)
      this._name = this.getAttribute('name')
      this.render()
    }

    render() {
      if (this._name) this.shadowRoot.querySelector('.hello').innerText = this._name
    }

    click(event) {
      //event.preventDefault()
      alert(this._name)
    }
    drag(event) {
      console.log('drag started',event)
    }
    drop(event) {
      console.log('dropped',event)
    }

  }
  let customElementRegistry = window.customElements;
  customElementRegistry.define('hello-hello', Hello)

})()
