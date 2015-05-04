/*
    File : config.js
    Author : Fernando Crespo Grávalos. fcgravalos@gmail.com
    Version : 1.0.0
*/

var config = {
    // Server Config
    ipAddress : "127.0.0.1", 
    port : 8080, 
    allowedMethods : ['GET', 'POST', 'PUT', 'DELETE'],
    
    // Gracenote API Config. Think if better in database to support multi-user API handling.
    clientId : "15779840-29EADFCFD79116D69600C0DDD4BC2AD8",
    userId : "26552415133633167-A5011D7797DCE7F1D8611C2D1315A5F1",
    //userId : "27115331114379558-D4DB8269117BF7C37B3CD1336C0BF4FB",
    gnApiUrl : "https://c15779840.ipg.web.cddbp.net/webapi/xml/1.0/"
};

function getProperty(key) {
    return config[key];
}

function setProperty(key, value) {
    config[key] = value;
}

module.exports = getProperty;