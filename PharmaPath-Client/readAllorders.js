const { clientApplication } = require('./client');

let userClient = new clientApplication();

userClient.submitTxn(
    "pharmacies",                  
    "pharmachain",                 
    "Pharma-Chain",                
    "OrderContract",               
    "readAllOrders",               
    {},                            
    "readAllOrders"              
).then(result => {
    console.log("All Orders Data: ", new TextDecoder().decode(result));
}).catch(error => {
    console.error("Error invoking readAllOrders:", error);
});
