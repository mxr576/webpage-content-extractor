# Web page Content Extractor (wce)
---

Extract the content of any web page by using various content extractor libraries.

Currently the following ones are implemented:

1. [readability.com's Parser API](https://www.npmjs.com/package/readability-api)
2. [read-art](https://www.npmjs.com/package/read-art)
3. [node-readablity](https://github.com/arrix/node-readability)
4. [node-unfluff](https://github.com/ageitgey/node-unfluff)
5. [wce-proxy](#wce-proxy)

This is the base module of the [Webpage Content Extractor API](https://github.com/mxr576/webpage-content-extractor-api) module.

## Usage example

```javascript
var winston = require('winston');
var util = require('util');
var wce = require('wce');
var logger = new (winston.Logger)({});
logger.add(winston.transports.Console, {
  prettyPrint: true,
  colorize: true
});

var extractors =['read-art', 'node-readability'];
var options = {};
var WCE = new wce(extractors, options);

try {
  WCE.extract('https://en.wikipedia.org/wiki/Hungary')
    .on('success', function (result, errors) {
      logger.log('info', result);
      if (errors && errors.length !== 0) {
        logger.log('warn', 'Extraction was successful, but there were some errors: %s', util.inspect(errors));
      }
    })
    .on('error', function (errors) {
      logger.log('error', 'Extraction failed with the following error(s): %s', util.inspect(errors));
    });
} catch (error) {
  logger.log('error', util.inspect(error));
}
```

## WCE-Proxy

It is a built-in wrapper for content proxies. This wrapper could be used to retrieve the previously extracted content of the URLs from a cache through a REST API.
This REST API could built in any language and it could store the content of the url in any database, but the wce-proxy wrapper was made, then I had a few expectations:

1. The content of an URL could be queried with a GET request, the queried URL sent in the GET parameter to the server. Ex.: http://wce-proxy/?url=http://cnn.com
    * If the proxy found content of the URL, then it is respond with 200 http status code and the respond's body contains the content of the URL.
    * If the content of the URL not found, then the responde code is 204 and the body is empty.
    * Any other status code will be handled as an error. The proxy could send back error messages in the repond's body.
2. The proxy could accept data through POST request. A request should contains two parameters: url and content.
    * When the content of URL successfully stored in the proxy's database, then the proxy should return with 200 http status code and the 'Success' message in the body.
    * Any other status code will be handled as an error, the respond's body could contains information about the reason.

### Licence
[Apache Licence 2.0](https://tldrlegal.com/license/apache-license-2.0-%28apache-2.0%29)
