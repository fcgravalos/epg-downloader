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
    clientId : "MY_CLIENT_ID",
    userId : "MY_USER_ID",
    gnApiUrl : "https://cXXXXXXX.ipg.web.cddbp.net/webapi/xml/1.0/"
};

function getProperty(key) {
    return config[key];
}

module.exports = getProperty;
