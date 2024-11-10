const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "wholesaler",                 
    "pharmachain", 
    "Pharma-Chain",                 
    "OrderContract",   
    "getOrders",
    "",
    "readOrder",          
    "Order-1"                      
).then(result => {
    console.log("Order Data: ", new TextDecoder().decode(result));
}).catch(error => {
    console.error("Error invoking readOrder:", error);
});
