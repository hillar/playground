export function dummy(){
  console.log('dummy called')
  return 'return from dummy'
}

export class SolrQuery extends HTMLElement {
  constructor() {
    console.log('constructor')
    super()
    this._q = null
    this._url = 'not set'
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const template = document.createElement('div');
    template.classList.add('solr-qyery');
    const instance = template.cloneNode(true)
    shadowRoot.appendChild(instance)
  }


  set q(value) { this._q = value; this.render()   }

  get q() { return this._q }

  static get observedAttributes() {
    return ['q','url']
  }

  async render() {
    let self = this.shadowRoot.querySelector('.solr-qyery')
    if (this._q && this._q.q) {
      self.innerHTML = `
          <div align="center">wait ..  ${this._q.q} ${this._q.op}</div>
      `;
      fetch(`${this._url}/select?q=${this._q.q.trim()}&rows=10`)
      .then( (response) => {
          console.log(response)
          if (response.status == 200) return response.json();

        })
        .then( (solr) => {
          console.log(solr);
          if (solr) {
          self.innerHTML = `
          <div justify-content:="" center="">
            <div class="b-table">
              <div class="table-wrapper">
                <table class="table has-mobile-cards">
                  <thead>
                    <tr>
                      <th width="40px"></th>
                      <th class="">
                        <div class="th-wrap">Score <span class="icon is-small" style="display: none;"><i class="mdi mdi-arrow-up"></i></span></div>
                      </th>
                      <th class="">
                        <div class="th-wrap">Highlights <span class="icon is-small" style="display: none;"><i class="mdi mdi-arrow-up"></i></span></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="">
                      <td class="chevron-cell"><a role="button"><span class="icon"><i class="mdi mdi-chevron-right mdi-24px"></i></span></a></td>
                      <td data-label="Score" class=""><span>
                           16.980799
                       </span></td>
                      <td data-label="Highlights" class=""><span><div> .. </div></span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- pagination -->
              <div class="level">
                <div class="level-left"> &nbsp;<b>Total found</b>: ${solr.response.numFound} </div>
                <div class="level-right">
                  <div class="level-item">
                    <div class="pagination"><a role="button" href="#" disabled="disabled" class="pagination-previous"><span class="icon"><i class="mdi mdi-chevron-left mdi-24px"></i></span></a> <a role="button" href="#" disabled="disabled" class="pagination-next"><span class="icon"><i class="mdi mdi-chevron-right mdi-24px"></i></span></a>
                      <ul class="pagination-list">
                        <li><a role="button" href="#" class="pagination-link is-current">
                          ${solr.response.start}
                      </a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
              <pre> ${JSON.stringify(solr,null,2)} </pre>
          `
          } else {
            self.innerHTML = `
                <pre>
                notify your admin, no json ;(
                </pre>
            `
          }
        })
        .catch( (e) => {
          console.dir(e)
          self.innerHTML = `
              <pre> notify your admin, some error ;( </pre>
              <hr>
              <pre>${e}</pre>
          `
        })
    } else {
      self.innerHTML = `
          <div align="center">do some search on :: ${this._url}</div>
      `;

    }
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    console.log('attributeChangedCallback',attr)
    const attribute = '_'+attr.toLowerCase()
    if (this[attribute]) this[attribute] = newVal
    //this.render()
  }

  connectedCallback() {
    console.log('connectedCallback')
    this.render()
  }

 }
 /*



 */
