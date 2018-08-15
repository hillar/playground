// remove empty elements
function zapArray(a) {

    a = [...(new Set(a))] // uniq
    let i = -1;
    const length = a ? a.length : 0;
    const result = [];
    while (++i < length) {
        const value = a[i];
        if (value && value.length > 0) {
            result.push(value)
        }
    }

    return result;

}


const Base = require('./base')

module.exports = class User extends Base {
  constructor (logger,uid,ssn, fn,ln,ou,manager,emails,phones,roles,groups) {
    super(logger)
    //$ for i in uid ssn fn ln ou manager emails phones roles groups; do echo "this._$i = $i "; done
    this.uid = uid
    this.ssn = ssn
    this.fn = fn
    this.ln = ln
    this.ou = ou
    this.manager = manager
    this.emails = emails
    this.phones = phones
    this.roles = roles
    this.groups = groups
  }

  //for i in uid ssn fn ln ou manager emails phones roles groups; do echo "get  $i () { return this._$i }"; done
  get  uid () { return this._uid }
  get  ssn () { return this._ssn }
  get  fn () { return this._fn }
  get  ln () { return this._ln }
  get  fullName () { return this._fn + ' '+ this._ln}
  get  ou () { return this._ou || ''}
  get  manager () { return this._manager || ''}
  get  emails () { return this._emails || []}
  get  phones () { return this._phones || []}
  get  roles () { return this._roles  || []}
  get  groups () { return this._groups || []}
  /*
  for i in uid ssn fn ln ou manager; do
  echo -en "set  $i ($i) {\n\tif (\!(Object.prototype.toString.call($i) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: $i not string  ' + typeof $i)\n\n\tif (\!$i) this.log_err({empty:'$i'})\n\telse this._$i = $i\n}\n\n";
  done | sed 's/\\//g'
  */


set  uid (uid) {
	if (!(Object.prototype.toString.call(uid) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: uid not string  ' + typeof uid)
	if (!uid.trim()) this.log_alert({empty:'uid'})
	else this._uid = uid
}

set  ssn (ssn) {
	if (!(Object.prototype.toString.call(ssn) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: ssn not string  ' + typeof ssn)
	if (!ssn.trim()) this.log_info({uid:this.uid,empty:'ssn'})
	else this._ssn = ssn
}

set  fn (fn) {
	if (!(Object.prototype.toString.call(fn) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: fn not string  ' + typeof fn)
	if (!fn.trim()) this.log_err({uid:this.uid,empty:'fn'})
	else this._fn = fn
}

set  ln (ln) {
	if (!(Object.prototype.toString.call(ln) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: ln not string  ' + typeof ln)
	if (!ln.trim()) this.log_err({uid:this.uid,empty:'ln'})
	else this._ln = ln
}

set  ou (ou) {
	if (!(Object.prototype.toString.call(ou) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: ou not string  ' + typeof ou)
	if (!ou.trim()) {}//this.log_info({uid:this.uid,empty:'ou'})
	else this._ou = ou
}

set  manager (manager) {
	if (!(Object.prototype.toString.call(manager) === '[object String]')) throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: manager not string  ' + typeof manager)
	if (!manager.trim()) {}//this.log_info({uid:this.uid,empty:'manager'})
	else this._manager = manager
}
/*
for i in uid semails,phones,roles,groups; do   echo -en "set  $i ($i) {  \nif (Object.prototype.toString.call($i) === '[object String]') $i = [$i]\nif (Array.isArray($i)) $i = zapArray($i)\nelse throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: checklist not a string nor array'+ typeof $i)\nif (Array.isArray($i) && $i.length > 0) this._$i = $i\nelse this.log_err({empty:'$i'})\n\n}\n\n"; done|sed 's/\\//g'
*/
//for i in emails phones roles groups; do   echo -en "set  $i ($i) {  \nif (Object.prototype.toString.call($i) === '[object String]') $i = [$i]\nif (Array.isArray($i)) $i = zapArray($i)\nelse throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: checklist not a string nor array'+ typeof $i)\nif (Array.isArray($i) && $i.length > 0) this._$i = $i\nelse this.log_err({empty:'$i'})\n\n}\n\n"; done|sed 's/\\//g'
set  emails (emails) {
if (Object.prototype.toString.call(emails) === '[object String]') emails = [emails.trim()]
if (Array.isArray(emails)) emails = zapArray(emails)
else throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: emails not a string nor array'+ typeof emails)
if (Array.isArray(emails) && emails.length > 0) this._emails = emails
//else this.log_notice({uid:this.uid,empty:'emails'})

}

set  phones (phones) {
if (Object.prototype.toString.call(phones) === '[object String]') phones = [phones.trim()]
if (Array.isArray(phones)) phones = zapArray(phones)
else throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: phones not a string nor array'+ typeof phones)
if (Array.isArray(phones) && phones.length > 0) this._phones = phones
//else this.log_info({uid:this.uid,empty:'phones'})

}

set  roles (roles) {
if (Object.prototype.toString.call(roles) === '[object String]') roles = [roles.trim()]
if (Array.isArray(roles)) roles = zapArray(roles)
else throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: roles not a string nor array'+ typeof roles)
if (Array.isArray(roles) && roles.length > 0) this._roles = roles
else this.log_notice({uid:this.uid,empty:'roles'})

}

set  groups (groups) {
if (Object.prototype.toString.call(groups) === '[object String]') groups = [groups.trim()]
if (Array.isArray(groups)) groups = zapArray(groups)
else throw new Error(Object.getPrototypeOf(this).constructor.name + ' :: groups not a string nor array'+ typeof groups)
if (Array.isArray(groups) && groups.length > 0) this._groups = groups
else this.log_err({uid:this.uid,empty:'groups'})

}

toObj () {
  const a = {}
  for (const s of this.setters) a[s] = this[s]
  return a
}

}
