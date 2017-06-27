/* Magic Mirror
 * Module: MMM-CARDS
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getCARDS: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body).cards; // .cards // Parsing an array
				console.log(response.statusCode + result);
                    this.sendSocketNotification('CARDS_RESULT', result);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_CARDS') {
            this.getCARDS(payload);
        }
    }
});
