# Verifie web-sdk

## Getting started with iframe solution, or You can use sample html app in sampleApp directory.


### 1. Obtaining a License Key

In order to start integration, you will need the **License Key**. You can mail a request to contact@verifie.global.


### 2. Creating a Session

With your License key, you should create a session by making a request to the Verifie backend from your server:

```shell
$ curl -X GET "https://api.verifie.ai/api/Main/AccessToken?LicenseKey=YOUR_LICENSE_KEY&PersonID=UNIQUEID_FOR_CLIENT" \
  -H "accept: text/plain" -H "Lang: ENG"

```
You will receive a response containing a JSON Web Token and iframe url.


### 3. Get session verification info

With your Json Web Token, you can get session verification info:

```shell
$ curl -X GET "https://api.verifie.ai/api/Main/TransactionInfo" -H "accept: text/plain" -H "Lang: ENG" -H "Authorization: Bearer TOKEN"
```


## Sessions Lifecycle

![flow](https://github.com/verifie-global/web-sdk/blob/master/flow.png?raw=true)
