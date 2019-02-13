const express = require('express');
const app = express();
const DBService = require("./DBService.js");
const URL = require("url");
const fs = require('fs');
const staticMiddleware = express.static('public');
const bodyParser = require('body-parser');
const jsonBodyParser = bodyParser("json");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const SECRET = "OYrtBkJ3ZqnV$oE6#??o";
const bcrypt = require("bcrypt");

DBService.init();

app.use(staticMiddleware);
app.use(jsonBodyParser);
app.use(cookieParser());
app.use('/products', staticMiddleware);
app.use('/panel/product', staticMiddleware);
app.use('/panel/login', staticMiddleware);
app.get('/', serveSPA);
app.get('/panel', function(req, res) {
  res.redirect('/panel/product');
});
app.get('/products/:product', serveSPA);
app.get('/panel/product', serveSPA);
app.get('/panel/login', serveSPA);
app.get('/panel/product/:id', serveSPA);
app.get('/api/products', checkToken);
app.get('/api/products', serveProducts);
app.post('/api/login', function (req, res) {
  DBService.getUserByEmail(req.body.login)
  .then(function(obj) {
    console.log(obj!==null && bcrypt.compareSync(req.body.password, obj.passwordHash));
    if (obj!==null && bcrypt.compareSync(req.body.password, obj.passwordHash)) {
      const payload = {
        email: obj.email
      };
      const token = jwt.sign(payload, SECRET, {
        expiresIn: "25m"
      });
       res.cookie('token', token, { path: '/', encode: String });
      return res.json(obj);
    }
    else {
      res.statusCode = 403;
      res.end();
      console.log('error');
    }
  })
  .catch(function() {
    res.statusCode = 403;
    res.write("Неверное имя или пароль");
      res.end();
  });
});
app.get('/api/login2', function (req, res) {
    res.cookie('user', 'test@yandex.ru', { path: '/', encode: String });
    res.end();
});
app.get('/api/me', checkToken);
app.get('/api/me', queryCookie);

app.get('/api/bcrypt', generateHash);
app.get('/api/products/:id', checkToken);
app.get('/api/products/:id', serveOneProduct);
app.put('/api/products/:id', checkToken);
app.put('/api/products/:id', function(req, res) {
  DBService.updateProduct(req.params.id, req.body)
    .then(function(result) {
      res.json(result);
    })
    .catch(console.log('ошибка'));
});
app.post('/api/products/', checkToken);
app.post('/api/products/', function(req, res) {
  DBService.insertProduct(req.body)
    .then(function(result) {
    const insertedItem = result.ops[0];
    res.json(insertedItem);
  })
    .catch();
});
app.use(serveNotFound);

function serveProducts(req, res) {
    const where = req.query;
const product = DBService.getProducts(where);
   product
  .then(function(product) {
    if (product.length===0) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.write('Not found');
      res.end();
    }
    else {
       res.json(product);
    }
  })
  .catch(function(err) {
    res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.write(err.message);
      res.end();
  });
}

function serveOneProduct(req, res) {
 const product = DBService.findById(req.params.id);
  product
  .then(function(product) {
        res.json(product);
  })
  .catch(function(err) {
    res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.write(err.message);
      res.end();
  });
}

function serveNotFound(req, res, customText) {
   const content = fs.readFileSync("public/spa.html");
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.write(content);
  res.end();
}

function serveSPA(req, res) {
  const content = fs.readFileSync("public/spa.html");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.write(content);
  res.end();
}

function setCookie(req, res) {
 const user = DBService.getUserByEmail(req.body.login);
  user
  .then(function(obj) {
    if (obj!==null && bcrypt.compareSync(req.body.password, obj.passwordHash)) {
      const payload = {
        email: "test@yandex.ru"
      };
      const token = jwt.sign(payload, SECRET, {
        expiresIn: "25m"
      });
      //res.statusCode = 200;
      //res.setHeader ("Set-Cookie", "token=" + token + "; path=/");
      //res.end();
      res.json(obj);
      
    }
    
    else {
      res.statusCode = 403;
      res.end();
      console.log('error');
    }
    
    
  })
  .catch(function() {
    res.statusCode = 403;
    res.write("Неверное имя или пароль");
      res.end();
  });
  
}

function queryCookie(req, res) {

  const user = DBService.getUserByEmail(req.user.email);
  user
  .then(function(user) {
    if (user!==null) {
      res.json(req.user.email);
    }
    
    else {
      res.statusCode = 403;
      res.end();
    }
  });

  }
  
  function generateHash (req,res) {
    const saltRounds = 10;

const hash = bcrypt.hashSync(req.query.password, saltRounds);
res.json(hash);

     }
     
 function checkToken(req, res, next) {
  
     try {
  const payload = jwt.verify(req.cookies.token, SECRET);
  req.user = payload;
  next();
} catch(err) {
  console.log(err)
  res.status(403);
  res.end();
}
 
}
  
  


app.listen(process.env.PORT, function() {
  console.log("Server started");
});
 