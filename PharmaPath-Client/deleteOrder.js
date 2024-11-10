const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "pharmacies",
    "pharmachain",                   
    "Pharma-Chain",                  
    "OrderContract",   
    "deleteOrder",
    "",                  
    "deleteOrder",  
    "Order-02"
).then(result => {
    console.log(new TextDecoder().decode(result));
    console.log("Order Order-02 has been successfully deleted.");
}).catch(error => {
    console.error("Error invoking deleteOrder:", error);
});
