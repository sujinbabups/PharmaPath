let profile = {
    manufacturer: {
        "cryptoPath": "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/manufacturer.pharma.com", 
		"keyDirectoryPath": "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/manufacturer.pharma.com/users/User1@manufacturer.pharma.com/msp/keystore/",
        "certPath":     "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/manufacturer.pharma.com/users/User1@manufacturer.pharma.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/manufacturer.pharma.com/peers/peer0.manufacturer.pharma.com/tls/ca.crt",
		"peerEndpoint": "localhost:7051",
		"peerHostAlias":  "peer0.manufacturer.pharma.com",
        "mspId": "ManufacturerMSP"
    },
    wholesaler: {
        "cryptoPath": "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/wholesaler.pharma.com", 
		"keyDirectoryPath": "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/wholesaler.pharma.com/users/User1@wholesaler.pharma.com/msp/keystore/",
        "certPath":     "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/wholesaler.pharma.com/users/User1@wholesaler.pharma.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/wholesaler.pharma.com/peers/peer0.wholesaler.pharma.com/tls/ca.crt",
		"peerEndpoint": "localhost:9051",
		"peerHostAlias":  "peer0.wholesaler.pharma.com",
        "mspId": "WholesalerMSP"
    },
    pharmacies: {
        "cryptoPath": "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/pharmacies.pharma.com", 
		"keyDirectoryPath": "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/pharmacies.pharma.com/users/User1@pharmacies.pharma.com/msp/keystore/",
        "certPath":     "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/pharmacies.pharma.com/users/User1@pharmacies.pharma.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/pharmacies.pharma.com/peers/peer0.pharmacies.pharma.com/tls/ca.crt",
		"peerEndpoint": "localhost:11051",
		"peerHostAlias":  "peer0.pharmacies.pharma.com",
        "mspId": "PharmaciesMSP"
    },
    regulators: {
        "cryptoPath": "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/regulators.pharma.com", 
		"keyDirectoryPath": "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/regulators.pharma.com/users/User1@regulators.pharma.com/msp/keystore/",
        "certPath":     "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/regulators.pharma.com/users/User1@regulators.pharma.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../../Pharmaceutical-Supply-Chain/organizations/peerOrganizations/regulators.pharma.com/peers/peer0.regulators.pharma.com/tls/ca.crt",
		"peerEndpoint": "localhost:12051",
		"peerHostAlias":  "peer0.regulators.pharma.com",
        "mspId": "RegulatorsMSP"
    }
}
module.exports = { profile }