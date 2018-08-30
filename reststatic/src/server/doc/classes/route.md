
# route

see [source](../../src/classes/route.js)

>  Route responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

Route holds *methods*

Methods must be listen in **[ROUTEMETHODS](../../src/classes/routemethods.js)**

Route holds for methods:

* roles
* groups

If not *defined in config* for method and defined in route, then method will inherit from route.
If not defined in route and defined in [router](router.md), then route will inherit from [router](router.md).

Route can have *html view*. If there is no params in request url, then *html, js & css* a served. For that *htmlroot* must point to directory with *html, js & css* files (running server with param --create-dummy-html will create dummy files).


### Method

> Method is the function [executed](https://github.com/hillar/playground/blob/3cf68d594012b873ab21bf4f2e5ec0d69d86bbdb/reststatic/src/server/src/classes/server.js#L361) when the __endpoint__ and __HTTP request method__ is matched and __user__ role(s) and group(s) __is in allowed__ list.

Function params:
* [logger](https://github.com/hillar/playground/blob/3cf68d594012b873ab21bf4f2e5ec0d69d86bbdb/reststatic/src/server/src/classes/server.js#L292)
* [user](../../src/classes/user.js)
* [request](https://nodejs.org/api/http.html#http_class_http_incomingmessage)
* [response](https://nodejs.org/api/http.html#http_class_http_serverresponse)


```javascript

const myserver = server.createServer({

  router:  {
        now:  { 
            // here is method function for http://localhost/now
            get: (logger,user,req,res) => {
              const now = Date.now()
              logger.log_info({now})
              res.write(JSON.stringify({hello:user,now}))
            }
        }
  }

})

```
