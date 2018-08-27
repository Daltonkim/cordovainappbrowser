/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    eventUrl: '',
    bindEvents: function() {
    	//document.addEventListener('deviceready', this.enablePushNotifications, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('resume', this.onResume, false);
    },
    onResume: function() {
    	console.log('resume evenuturl: '+app.eventUrl);
    	if(app.eventUrl != '') {
    		ref = app.ref;
    		ref.executeScript({code: 'window.location.href="'+app.eventUrl+'"'});
    		app.eventUrl = '';
		}
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	var openWindow = function() {
            var ref = cordova.InAppBrowser.open('https://www.clubgroeneveld.nl/login/item16', '_blank', 'location=no,zoom=no,toolbar=no');
            ref.addEventListener('exit', function(event) { navigator.app.exitApp() });
            var loadStop = function(event) {
            	app.enablePushNotifications(ref);
            	ref.removeEventListener('loadstop', loadStop);
            };
            ref.addEventListener('loadstop', loadStop);      	
        };
    	document.addEventListener("online", openWindow, false);   
    	document.addEventListener("offline", function() {
            alert('Er kon geen verbinding gemaakt worden.');
            navigator.app.exitApp();
    	}, false);
    	if (navigator.network.connection.type != 'none') {
    		openWindow();
    	}
    },
    enablePushNotifications: function(ref) {
    	pushNotification = window.plugins.pushNotification;
    	
    	onNotificationIos = function(event) {
    		if(event.foreground == 0) {
    			app.eventUrl = event.url;
    			app.ref = ref;
    			console.log(event.url);
    			console.log(app.eventUrl);
    			
//    			ref.executeScript({code: 'window.location.href="'+event.url+'"'});
    		}
//    		else {
//    		}
    	};
    	
    	pushNotification.register(function(result) {
    		ref.executeScript({code: 'var x = new XMLHttpRequest(); x.open("GET", "index.php?r=app/iosToken&token='+result+'", false); x.send();'});
    	}, function(result) {
    	}, {
    		'badge': 'true',
    		'sound': 'true',
    		'alert': 'true',
    		'ecb': 'onNotificationIos'
    	});
    }
};

app.initialize();