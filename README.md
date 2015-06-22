# Webpage content extractor
---

Extract the content of webpages by using various content extractor libraries. Currently the following ones are implemented:
1. [readability.com's Parser](https://www.readability.com/developers/api/parser)
2. [node-readablity](https://github.com/arrix/node-readability)
3. [node-unfluff](https://github.com/ageitgey/node-unfluff)

### How to use

```sh
git clone https://github.com/mxr576/webpage-content-extractor.git
cd webpage-content-extractor
www/bin
```
The extractor listen on the 8001 port, by default. You can test it via [http://127.0.0.1:8001/?url=http://cnn.com](http://127.0.0.1:8001/?url=http://cnn.com).

The default extractor is node-readability. You can change this in the **config/default.json** file or you can override it with environment specific settings, for example in **conf/development.json** file. 

If you would like to use the readablity.com's Parser, then you have to set up your access token in the config file beforehand. You can clain your Parser key [here](https://www.readability.com/developers/api).

### Licence
MIT