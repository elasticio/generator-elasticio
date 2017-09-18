# <%- componentName %>
<%- componentTitle %> component for the [elastic.io platform](http://www.elastic.io "elastic.io platform")

If you plan to **deploy it into [elastic.io platform](http://www.elastic.io "elastic.io platform") you must follow sets of instructions to succeed**.

## Authentication

Authentication is happening via OAuth2.0. In order to make OAuth work you need a new App in your XXX.
During app creation process you will be asked to specify
the callback URL, to process OAuth auehtncation via elastic.io platform your callback URL should be

```
https://your-tenant.elastic.io/callback/oauth2
```

If you are testing it on default public tenant just use ``https://app.elastic.io/callback/oauth2``


## Configure OAuth Client key/secret

In the component repository you need to specify OAuth Client credentials as environment variables. You would need two variables

 * ```XXX_KEY``` - your OAuth client key
 * ```XXX_SECRET``` - your OAUth client secret

## Actions


## Triggers


## Known issues

No known issues are there yet.
