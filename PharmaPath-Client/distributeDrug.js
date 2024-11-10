const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "wholesaler",                   
    "pharmachain",                  
    "Pharma-Chain",                 
    "PharmaSupplyChainContract",    
    "distributeDrug",
    "",
    "distributeDrug",   
    "BATCH123",                     
    "WHOLESALER001",
    "50",            
    "2024-11-01T10:00:00Z",         
    "Temperature controlled"        
).then(result => {
    console.log(new TextDecoder().decode(result));
    console.log("Drug batch BATCH123 is now in transit by wholesaler WHOLESALER001");
}).catch(error => {
    console.error("Error invoking distributeDrug:", error);
});
