
# router

see [source](../../src/classes/router.js)

Router holds **[routes](route.md)**.

One of routes can be declared as default, then '/' will be redirected there.

Router can hold for routes:
* roles
* groups
* htmlroot

If not defined in route and defined in router, then route will inherit from router

If not defined in router and defined in server, then router will inherit from server
