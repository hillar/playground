
# intro

**it** does not have name yet ;(

how i see it now is: *rest server serving SPA's, what use that rest server*

 > it must authenticate and authorize and __log__ every access request for each service

 > it must be [sysadmin](sysadmin.md) friendly

 > it must be [programmer](programmer.md) friendly

 > it must pass audit [1](http://pcidsscompliance.net/pci-dss-requirements/how-to-comply-to-requirement-10-of-pci-dss/),[2](https://www.ria.ee/en/iske-en.html), [3](https://www.bsi.bund.de/DE/Themen/ITGrundschutz/itgrundschutz_node.html), [4](https://edps.europa.eu/sites/edp/files/publication/it_governance_management_en.pdf),...

#### Motivation

see https://www.npmjs.com/search?q=http%20basic%20auth

and then compare to

```javascript
  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const strauth = new Buffer.from(b64auth, 'base64').toString()
  const splitIndex = strauth.indexOf(':')
  const username = strauth.substring(0, splitIndex).toLowerCase()
  const password = strauth.substring(splitIndex + 1)
```

## Inheritance

> server -> router -> route -> method

* If not *defined in config (or given from command line)* for __method__ and defined in route, then method will inherit from route.
* If not defined in __route__ and defined in router, then route will inherit from router
* If not defined in __router__ and defined in server, then router will inherit from server

## Logging


# Classes

# Samples
