//<debug>
Ext.Loader.setPath({
    'Ext': 'js/src',
    'Ext.plugin': 'js/map/lib/plugin'
});
//</debug>


Ext.application({
    startupImage: {
        '320x460': 'js/map/resources/startup/Default.jpg', // Non-retina iPhone, iPod touch, and all Android devices
        '640x920': 'js/map/resources/startup/640x920.png', // Retina iPhone and iPod touch
        '640x1096': 'js/map/resources/startup/640x1096.png', // iPhone 5 and iPod touch (fifth generation)
        '768x1004': 'js/map/resources/startup/768x1004.png', //  Non-retina iPad (first and second generation) in portrait orientation
        '748x1024': 'js/map/resources/startup/748x1024.png', //  Non-retina iPad (first and second generation) in landscape orientation
        '1536x2008': 'js/map/resources/startup/1536x2008.png', // : Retina iPad (third generation) in portrait orientation
        '1496x2048': 'js/map/resources/startup/1496x2048.png' // : Retina iPad (third generation) in landscape orientation
    },

    isIconPrecomposed: false,
    icon: {
        57: 'js/map/resources/icons/icon.png',
        72: 'js/map/resources/icons/icon@72.png',
        114: 'js/map/resources/icons/icon@2x.png',
        144: 'js/map/resources/icons/icon@144.png'
    },

    requires: [
        'Ext.Map',
        'Ext.Button',
        'Ext.SegmentedButton',
        'Ext.Panel',
        'Ext.Toolbar',
        'Ext.plugin.google.Traffic',
        'Ext.plugin.google.Tracker',
		'Ext.field.TextArea'
    ],

    launch: function() {
	
		var txtLat, txtLong, cboMes, Info;
		var position;

        txtLat = Ext.create('Ext.field.Text', {
            name: 'lat',
            placeHolder: 'Latitud'
        });
		
		txtLong = Ext.create('Ext.field.Text', {
            name: 'long',
            placeHolder: 'Longitud'
        });
		
		Info = Ext.create('Ext.field.TextArea', {
            name: 'info',
            placeHolder: 'Info'
        });
		
        selectField = Ext.create('Ext.field.Select', {
            name: 'mes',
			autoscroll: true,
            options: [
                { text: 'Enero',  value: '1' },
                { text: 'Febrero', value: '2' },
                { text: 'Marzo', value: '3' },
                { text: 'Abril', value: '4' },
                { text: 'Mayo', value: '5' },
                { text: 'Junio', value: '6' },
                { text: 'Julio', value: '7' },
                { text: 'Agosto', value: '8' },
                { text: 'Septiembre', value: '9' },
                { text: 'Octubre', value: '10' },
                { text: 'Noviembre', value: '11' },
                { text: 'Diciembre', value: '12' }
            ]
        });
       
        position = new google.maps.LatLng(-17.7838446, -63.1773953),  

            infowindow = new google.maps.InfoWindow({
                content: ''
            }),
            
            image = new google.maps.MarkerImage(
                'js/map/resources/images/point.png',
                new google.maps.Size(32, 31),
                new google.maps.Point(0, 0),
                new google.maps.Point(16, 31)
            ),

            shadow = new google.maps.MarkerImage(
                'js/map/resources/images/shadow.png',
                new google.maps.Size(64, 52),
                new google.maps.Point(0, 0),
                new google.maps.Point(-5, 42)
            ),

            trackingButton = Ext.create('Ext.Button', {
                iconCls: 'locate'
            }),

            trafficButton = Ext.create('Ext.Button', {
                pressed: true,
                iconCls: 'maps'
            }),

            toolbar = Ext.create('Ext.Toolbar', {
                docked: 'top',
                ui: 'light',
                items: [txtLat, txtLong, selectField, 	
					
					new Ext.Button({
						text: 'Find',
						handler: function() {
							alert('poner marcador aqui');
							refresh(this.MapHome);     
                        }
					}),
                    {
                        iconCls: 'home',
                        handler: function() {
                            
                            var segmented = Ext.getCmp('segmented'),
                                pressedButtons = segmented.getPressedButtons(),
                                trafficIndex = pressedButtons.indexOf(trafficButton),
                                newPressed = (trafficIndex != -1) ? [trafficButton] : [];
                            segmented.setPressedButtons(newPressed);
                            MapHome.getMap().panTo(position);
                        }
                    },
                    {
                        id: 'segmented',
                        xtype: 'segmentedbutton',
                        allowMultiple: true,
                        listeners: {
                            toggle: function(buttons, button, active) {
                                if (button == trafficButton) {
                                    MapHome.getPlugins()[1].setHidden(!active);
                                }
                                else if (button == trackingButton) {
                                    var tracker = MapHome.getPlugins()[0],
                                        marker = tracker.getMarker();
                                    marker.setVisible(active);
                                    if (active) {
                                        tracker.setTrackSuspended(false);
                                        Ext.defer(function() {
                                            tracker.getHost().on('centerchange', function() {
                                                marker.setVisible(true);
                                                tracker.setTrackSuspended(true);
                                                var segmented = Ext.getCmp('segmented'),
                                                    pressedButtons = segmented.getPressedButtons(),
                                                    trafficIndex = pressedButtons.indexOf(trafficButton),
                                                    newPressed = (trafficIndex != -1) ? [trafficButton] : [];
                                                segmented.setPressedButtons(newPressed);
                                            }, this, {single: true});
                                        }, 50, this);
                                    }
                                }
                            }
                        },
                        items: [
                            //trackingButton, trafficButton
                        ]
                    }
                ]
            });

        var MapHome = new Ext.Map({
			title: 'Map',
			useCurrentLocation: true,
			listeners: {
				centerchange : function(comp, map){					
					refreshMap(map);
				}								
		   },
			mapOptions : {
				mapTypeControl : true,
				navigationControl : true,
				streetViewControl : true,
				backgroundColor: 'transparent',
               // mapTypeId : google.maps.MapTypeId.HYBRID,
				disableDoubleClickZoom: true,
				zoom: 12,
				draggable: true,
				keyboardShortcuts: false,
				scrollwheel: true, 
                navigationControl: true,

                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.DEFAULT
                },
				mapTypeId: google.maps.MapTypeId.ROADMAP
		   }		   		   	   		   
		});
		/*
		google.maps.event.addListener(MapHome, "click", function(e){
			alert('test');    
		});
		*/
		refresh = function(theMap) {
            var geoTag = {
                lat: '47.584863',
                longi: '-122.147026',
                text: 'Hello World',
            }
            addMarker(geoTag, theMap);
        }
		
		var refreshMap = function(themap){			
			var marker = new google.maps.Marker({
				position: themap.center,
				title : 'Mi posicion Actual',
				map: themap
			}); 			
		}

        addMarker = function(geoTag, theMap) {
            var latLng = new google.maps.LatLng(geoTag.lat, geoTag.longi);
            var marker = new google.maps.Marker({
                map: theMap,
                position: latLng
            });
			
			google.maps.event.addListener(marker, "click", function() {
                geoTagBubble.setContent(tweet.text);
                geoTagBubble.open(theMap.map, marker);
            });
        };
		
		var geo = Ext.create('Ext.util.Geolocation', {
			autoUpdate: true,
			frequency: '5000',
			listeners: {
				locationupdate: function (geo) {
					//position = new google.maps.LatLng(geo.getLatitude(), geo.getLongitude());
					txtLat.setValue(geo.getLatitude());
					txtLong.setValue(geo.getLongitude());
				}
			}
		});	
		
		 var res1 = {
                xtype: 'textareafield',
				label: 'Info :',
				maxRows: 4,
				name: 'info'
            }

		var res = Ext.create('Ext.form.Panel', {
            //docked: 'bottom',
            items: [{
                    xtype: 'textareafield',
                    label: 'Info :',
                    maxRows: 4,
                    name: 'info',
					text: 'EE = 150MW  \n Eg = 50MW'
                }]            
        });
		
		Info.setValue('Info: Es : 200 MW   -   Ee:  250 MW   -   Eg:   300 MW');
		
		toolbarbot = Ext.create('Ext.Panel', {
			docked: 'bottom',
			//ui: 'light',
			//height:200,
			bodyStyle:{"background-color":"blue"},
			items: [Info]
		});

        Ext.create('Ext.Panel', {
            fullscreen: true,
            layout: 'fit',
            items: [toolbar, MapHome, toolbarbot]
        });
    }
});
