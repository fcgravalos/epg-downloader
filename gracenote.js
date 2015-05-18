/*
 * File : gracenote.js
 * Author : Fernando Crespo Grávalos. fcgravalos@gmail.com
 * Version : 1.0.0
 * Description : A pure nodejs wrapper for Gracenote API.
*/

// Load required modules
var fs = require('fs');
var gnRequest = require('https').request;
var xmlBuilder = require('xmlbuilder');
var xmlParser = require('xml2js').parseString;
var config = require('./config.js');

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

var commands = {
    register: 'REGISTER',
    tvprovider: 'TVPROVIDER_LOOKUP'
};

/*************
 *************
 * FUNCTIONS *
 *************
 *************/

/*******************************
 * SECTION : GENERIC FUNCTIONS *
 *******************************/
function queryComposer(){}
function authenticate(){
    return {
        AUTH: {
            CLIENT: {
                '#text': clientId
            },
            USER: {
                '#text': userId       
                    }   
            }
    }
}
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

/************************************
 * SECTION: ERROR HANDLING FUNCTION *
 ************************************/

/*
 * Function: gnError.
 * Description: Prints out error message that GraceNote provides. To improve.
 * Receives: A String which contains the error message.
 */
function gnError(error) {
    console.error("[FAILED] " + error);
}

/*****************************************
 * SECTION: GRACENOTE REGISTER FUNCTIONS *
 *****************************************/

/*
 * Function: initialize.
 * Description: Init function to be called at bootup. It will register 
 * the user in Gracenote.
 */
function initialize(){
    userId === "@@USERID@@" ? register() : console.log("[INFO] Found user ID in config: " + userId)
}

/*
 * Function: register.
 * Description: Builds the XML body request and passes it and the registerCallback 
 * to gnHttpRequest
 */  
function register() {
    var xml = xmlBuilder.create({
        QUERIES: {
            QUERY: {
                '@CMD': commands.register, 
                CLIENT: {
                    '#text': clientId
                }
            } 
        }
    }).end({pretty:true});
    gnHttpRequest(xml, registerCallback);
}

/*
 * Function: registerCallback.
 * Description: Callback function that will be passed to gnHttpRequest.
 * It will update config.js with the new userId fetched from Gracenote.
 * Parameter: A String which contains the XML response from Gracenote.
 */  
function registerCallback(xmlResponse){
    xmlParser(xmlResponse, function(error, data){
        if(error) throw(error);
        else {
            var status = data.RESPONSES.RESPONSE[0]['$'].STATUS
            status === 'OK' ? updateUserId(userId, 
                data.RESPONSES.RESPONSE[0].USER[0]) : gnError(data.RESPONSES.MESSAGE[0])      
        }
    }); 
}

/*
 * Function: updateUserId.
 * Description: Updates config file with a User ID provided by Gracenote.
 * Global variable userId is updated as well with the new value.
 * Parameter: A String, which represents the current userId.
 * Parameter: A String, which represents the new userId.
 */
function updateUserId(userId, newUserId) {
    // This needs to be done synchronously. This could change to async if multi API users //supported.
    var configFileContent = fs.readFileSync('./config.js', {encoding: 'utf-8'});
    configFileContent = configFileContent.replace(userId, newUserId);
    fs.writeFileSync('./config.js', configFileContent);
    console.log("[OK] CONFIGURATION UPDATED SUCCESSFULLY!");
    userId = newUserId;
    console.log("[OK] Your user ID has been updated to: " + userId);
}

/***************************************************
 * SECTION : GRACENOTE TVPROVIDER LOOKUP FUNCTIONS *
 ***************************************************/

/*
 * Function: tvProviderLookupCallback.
 * Description: Callback function that will be passed to gnHttpRequest.
 * Parameter: A String which represents the XML response from Gracenote.
 */ 
function tvProviderLookupCallback(xmlResponse){
    console.log(xmlResponse);
}

/*
 * Function: tvProviderLookup.
 * Description: Builds the XML body request and passes it and the tvProviderLookupCallback 
 * to gnHttpRequest
 */
function tvProviderLookUp(lang, country, postalCode){
    var xml = xmlBuilder.create({
        QUERIES: {
             AUTH: {
                    CLIENT: {
                        '#text': clientId
                    },
                    USER: {
                        '#text': userId       
                    }   
            },
            LANG: {
                '#text': lang
            },
            COUNTRY: {
                '#text': country
            },
            QUERY: {
                '@CMD': commands.tvprovider,
                POSTALCODE: {
                    '#text': postalCode
                }      
            }
        }
    }).end({pretty:true});
    //console.log(xml)
    gnHttpRequest(xml, tvProviderLookupCallback);
}

/************************************************
 * SECTION : GRACENOTE CHANNEL LOOKUP FUNCTIONS *
 ************************************************/

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

tvProviderLookUp('ger', 'usa', '94608');