import { dummy } from './dummy.js'

console.log('main',dummy())

// check customElements
if (window.customElements) {
  console.log('customElements ok')
} else {
  document.body.innerHTML='<h1>this brwoser is not supported ;(</h1>'
}
