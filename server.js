
// # SimpleServer
const ProductService = require("./ProductService.js");
const http = require('http');
const URL = require("url");
const fs = require('fs');
const path = require('path');
const ejs = require("ejs");
const queryString = require('query-string');
ProductService.init();
const server = http.createServer(function(req, res) {
  const parsedURL = URL.parse(req.url);
  
  switch (parsedURL.pathname) {
    case "/":
      //serveIndex(req, res);
      serveSPA(req, res);
    break;
   
    default:
   // if (parsedURL.pathname.indexOf("/product/") === 0) {
      //serveProduct (req, res, parsedURL);
    //  serveSPA(req, res);
   // }
   
    if (parsedURL.pathname.indexOf("/api/products") === 0) {
      serveAPI(req, res,parsedURL);
    }
   
    else {
      serveStatic(req, res);
    }
    break;
  }
});

function serveStatic(req, res,customFileName) {
 const filename = customFileName
   ? customFileName
   : path.basename(req.url);
   const extension = path.extname(filename);
   const file = "public/" + filename;
   fs.stat(file, function(err, stats) {
    if (err) {
        serveSPA(req, res);
    } else {
    const content = fs.readFileSync(file);
         switch (extension) {
    case ".js":
      res.statusCode = 200;
      res.setHeader("Content-Type", "script/javascript");
      res.write(content);
      res.end();
    break;        
    case ".html":
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.write(content);
      res.end();
    break;
    case ".css":
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/css");
      res.write(content);
      res.end();
    break;
    case ".jpg":
      res.statusCode = 200;
      res.setHeader("Content-Type", "image/jpeg");
      res.write(content);
      res.end();
    break;
    case ".ico":
      res.statusCode = 200;
      res.setHeader("Content-Type", "image/x-icon");
      res.write(content);
      res.end();
    break;
    default:
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.write('Not found');
      res.end();
    break;
  }
        
    }
});
   
   
}
function serveIndex(req, res) {
  const products = ProductService.getProducts();
  products.then(function(products) {
  const scope = {products: products};
  const content = fs.readFileSync("static/index.html").toString();
    const template = ejs.compile(content);
    const indexPage = template(scope);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write(indexPage);
    res.end();
  });
}
function serveProduct(req, res, parsedURL) {
  const slugFull = parsedURL.pathname;
  const slugPart = slugFull.replace("/product/", "");
  const slugParts = slugPart.split("-");
  const key = slugParts[0];
  const slug = slugPart.slice(key.length + 1);
  const keyNum = Number(key);
  const product = ProductService.getProductByKey(keyNum);
  product.then(function(product) {
    if (!product) {
      serveNotFound(req, res, "Введенный вами товар не найден");
    }
    else {
      if (slug!==product.slug) {
        const bigString = `/product/${keyNum}-${product.slug}`;
        res.statusCode = 301;
        res.setHeader("Location", bigString);
        res.end();
      }
      else {
        const scope = {product: product};
        const content = fs.readFileSync("static/product.html").toString();
        const template = ejs.compile(content);
        const indexPage = template(scope);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.write(indexPage);
        res.end();
      }
    }
    
  });
}

function serveNotFound(req, res, customText) {
   if (!customText) {
  customText = 'Not found';
}
    const scope = {customText};
    const content = fs.readFileSync("static/error.html").toString();
    const template = ejs.compile(content);
    const indexPage = template(scope);
    res.statusCode = 400;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.write(indexPage);
  //(customText) ? res.write(customText) : res.write('Not found');
  res.end();
}

function serveSPA(req, res) {
  const content = fs.readFileSync("public/spa.html");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.write(content);
  res.end();
}

function serveAPI(req, res,parsedURL) {
  const where = queryString.parse(parsedURL.search);
  const product = ProductService.getProducts(where);
  //const slugFull = parsedURL.pathname;
  //const slugPart = slugFull.replace("/api/products", "");
  //const product = ProductService.findById(slugPart);
  product
  .then(function(product) {
    if (product.length===0) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.write('Not found');
      res.end();
    }
    else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(product));
        res.end();
    }
  })
  .catch(function(err) {
    res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.write(err.message);
      res.end();
  });
}

server.listen(process.env.PORT);