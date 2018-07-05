import { dummy, SolrQuery } from './dummy.js'

 // check customElements
 if ('customElements' in window) {
   console.log('customElements ok')
   // let the browser know about the custom elements
   let customElementRegistry = window.customElements;
   customElementRegistry.define('solr-query', SolrQuery)
 } else {
   document.body.innerHTML='<h1>customElements is not supported ;(</h1>'
 }
 console.log('main',dummy())
