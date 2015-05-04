/*
 * File : gracenote.js
 * Author : Fernando Crespo Grávalos. fcgravalos@gmail.com
 * Version : 1.0.0
 * Description : A pure nodejs wrapper for Gracenote API.
*/

// Load required modules
var gnRequest = require('https').request;
var config = require('./config.js');
var fs = require('fs');

// Reading properties from config. 
var apiUrl = config('gnApiUrl');
var clientId = config('clientId');
var userId = config('userId');

// HTTPS options for Gracenote API
var options = {
    hostname: /^https:\/\/([a-z0-9\.]+)\/.*$/.exec(apiUrl)[1],
    path: /^https:\/\/[a-z0-9\.]+(\/.*)$/.exec(apiUrl)[1],
    method: 'POST',
    headers: {
        'Content-Type': 'text/xml',
        //'Content-Length': "@@PLACEHOLDER@@"
    }

};

/*************
 *************
 * FUNCTIONS *
 *************
 *************/

/*******************************
 * SECTION : GENERIC FUNCTIONS *
 *******************************/

/*
 * Function: gnHttpRequest.
 * Description: A generic function to create HTTPS requests to Gracenote 
 * API.
 * Parameter: A String, which represents the body.
 * Parameter: A function. This will be the callback that will be called
 * depending on the request.
 */

function gnHttpRequest(body, callback) {  
    var xmlResponse='';
    options.headers['Content-Lenght'] = body.length;
    var request = gnRequest(options, function(response){
        response.setEncoding('utf-8');
        response.on('data', function(chunk){
            xmlResponse += chunk;       
        });
        
        response.on('error', function(error){
            console.log(error.message);
        });
        response.on('end', function(){
            callback(xmlResponse);
        });
    });
    request.write(body);
    request.end();
}

/******************************************
 * SECTION : GRACENOTE REGISTER FUNCTIONS *
 ******************************************/

/*
 * Function: initialize.
 * Description: Init function to be called at bootup. It will register 
 * the user in Gracenote.
 */
function initialize(){
    userId === "@@USERID@@" ? register() : undefined
}

/*
 * Function: registerCallback.
 * Description: Callback function that will be passed to gnHttpRequest.
 * It will update config.js with the new userId fetched from Gracenote.
 * Parameter: A String which represents the XML response from Gracenote.
 */  
function registerCallback(xmlResponse){
    console.log(xmlResponse);
    var newUserId = "26552415133633167-A5011D7797DCE7F1D8611C2D1315A5F1";
    // This needs to be done synchronously. This could change to async if multi API users //supported.
    console.log("[INFO] UPDATING CONFIGURATION");
    var configFileContent = fs.readFileSync('./config.js', {encoding: 'utf-8'});
    configFileContent = configFileContent.replace(userId, newUserId);
    fs.writeFileSync('./config.js', configFileContent);
    console.log("[INFO] CONFIGURATION UPDATED SUCCESSFULLY!");
}

/*
 * Function: register.
 * Description: Builds the XML body request and passes it and the registerCallback 
 * to gnHttpRequest
 */  
function register() {  
    gnHttpRequest("<QUERIES><QUERY CMD='REGISTER'><CLIENT>15779840-29EADFCFD79116D69600C0DDD4BC2AD8</CLIENT></QUERY></QUERIES>", registerCallback);
}

/***************************************************
 * SECTION : GRACENOTE TVPROVIDER LOOKUP FUNCTIONS *
 ***************************************************/

/*
 * Function: tvProviderLookupCallback.
 * Description: Callback function that will be passed to gnHttpRequest.
 * Parameter: A String which represents the XML response from Gracenote.
 */ 
function tvProviderLookupCallback(xmlResponse){}

/*
 * Function: tvProviderLookup.
 * Description: Builds the XML body request and passes it and the tvProviderLookupCallback 
 * to gnHttpRequest
 */
function tvProviderLookUp() {}

/***************************************************
 * SECTION : GRACENOTE CHANNEL LOOKUP FUNCTIONS    *
 ***************************************************/

/*
 * Function: tvChannelLookupCallback.
 * Description: Callback function that will be passed to gnHttpRequest.
 * Parameter: A String which represents the XML response from Gracenote.
 */ 
function channelLookUpCallback(){}

/*
 * Function: tvChannelLookup.
 * Description: Builds the XML body request and passes it and the tvProviderChannelCallback 
 * to gnHttpRequest
 */
function channelLookUp(){}

initialize();