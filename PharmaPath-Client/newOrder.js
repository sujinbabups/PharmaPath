const { clientApplication } = require('./client');

let userClient = new clientApplication();

const transientData = {
    drugName: Buffer.from("Painkiller"),
    dosage: Buffer.from("500mg"),
    quantity: Buffer.from("100"),
    pharmacyName: Buffer.from("PharmaStore"),
}

userClient.submitTxn(
    "pharmacies",
    "pharmachain",
    "Pharma-Chain",
    "OrderContract",
    "newOrder",
    transientData,
    "createOrder",
    "Order-1",
)
.then(result => {
    if (result) {
        console.log(new TextDecoder().decode(result));
        console.log("New order created");
    
    } 

})




