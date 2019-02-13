const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
let shopDatabase;
let productCollection;
let userDatabase;
let userCollection;
module.exports = {
    init() {
MongoClient.connect('mongodb://localhost:27017')
        .then(function (clientInstance) {
            shopDatabase = clientInstance.db("shop");
            productCollection = shopDatabase.collection("product");
             userDatabase = clientInstance.db("user");
            userCollection = userDatabase.collection("user");
        });
  },
    
    getProducts(where) {
        if (where.key) {
            where.key = Number(where.key);
        }
        const cursor = productCollection.find(where);
        const promise = cursor.toArray();
        return promise;  
    },
    getProductByKey(where) {
        
        const cursor = productCollection.find(where);   
        const promise = cursor.toArray();
        return promise;
        
           
    },
    findById(id) {
        const MongoClient = require('mongodb').MongoClient;
        const ObjectID = require('mongodb').ObjectID;
            try {
                const mongoId = ObjectID(id);
            }
            catch(err) {
                return Promise.reject(err);
            }
            const promise = productCollection.findOne({ _id: ObjectID(id) });
            return promise; 
    },
    updateProduct(id, patch) {
        return new Promise(function(resolve, reject) {
            
            try {
             const MongoClient = require('mongodb').MongoClient;   
            const ObjectID = require('mongodb').ObjectID;
            const obj = _.omit(patch, ['_id']);
            const promise = productCollection.update(
                { _id: ObjectID(id) },
                {
                    $set: obj
                }
            );
            resolve(id);
            promise
            .then(function(id) {
                const promise1 = productCollection.findOne({ _id: ObjectID(id) });
                return promise1; 
            })
            .catch(error => console.log(error));
            }
            catch(err) {
                return Promise.reject(err);
            }
            
        });
        
    },
    
    insertProduct(patch) {
        return new Promise(function(resolve, reject) {
            
            try {
             const MongoClient = require('mongodb').MongoClient;   
            const promise = productCollection.insertOne(patch);
            return promise
            }
            catch(err) {
                return Promise.reject(err);
            }
            
        });
        
    },
   getUserByEmail (email) {
           const promise = userCollection.findOne({ email: email });
            return promise;
    }, 
    
    
    
};


    
    

  
  