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
    userId : "280724324967249114-6796C6E52EBD6677D828DBEE8334DC6D",
    gnApiUrl : "https://c15779840.ipg.web.cddbp.net/webapi/xml/1.0/"
};

function getProperty(key) {
    return config[key];
}

module.exports = getProperty;