var app = angular.module('pickup_locater',['ngRoute']);

app.config(function($routeProvider, $httpProvider) {
    $routeProvider
        .when("/partial1", {
            templateUrl: "/partials/partial1.html",
            controller: "playersController"
        })
        .when("/partial2", {
            templateUrl: "/partials/partial2.html",
            controller: "teamsController"
        })
        .when("/partial3", {
            templateUrl: "/partials/partial3.html",
            controller: "playersController"
        })
        //jquery to get token value and setting in as a default header
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
});


app.controller("playersController", function($scope, playerFactory, teamFactory){
    teamFactory.index(function(json) {
        $scope.teams = json
    })

    playerFactory.index(function(json) {	
    	$scope.players = json;
    })
    
    $scope.createPlayer = function(){
        playerFactory.create($scope.newPlayer, function(json){
            $scope.players = json;
            $scope.newPlayer = {};
        });
    }
    $scope.deletePlayer = function(playerId) {
    	playerFactory.delete(playerId, function(json){
    		$scope.players = json;
    	})
    }
})

app.controller("teamsController", function($scope, teamFactory){
    teamFactory.index(function(json) {
    	$scope.teams = json;
    })  
    $scope.createTeam = function() {
        
    	teamFactory.create($scope.newTeam, function(json) {
    		$scope.teams = json;
    		$scope.newTeam = {};
    	});
    }
    $scope.deleteTeam = function(teamId) {
    	teamFactory.delete(teamId, function(json) {
    		$scope.teams = json;
    	})
    }
})

app.factory("playerFactory", function($http) {
	var factory = {};
	factory.index = function(callback) {
		$http.get("/players").success(function(output) {
			callback(output);
		})
	}

	factory.create = function(playerInfo, callback){
        
        $http.post("/players", playerInfo).success(function(output){
            callback(output);
        })
    }

    factory.delete = function(id, callback) {
    	$http.delete("/players/" + id).success(function(output) {
    		callback(output);
    	})
    }
	return factory;
})



app.factory("teamFactory", function($http) {
	var factory = {};
	factory.index = function(callback) {
		$http.get("/teams").success(function(output) {
			callback(output);
		})
	}

	factory.create = function(playerInfo, callback) {
        
		$http.post("/teams", playerInfo).success(function(output) {
			callback(output);
		})
	}
	factory.delete = function(id, callback) {
		$http.delete("/teams/" + id).success(function(output) {
			callback(output);
		})
	}
	return factory;
})


app.directive('myMap', function() {

	var link = function(scope, element, attrs) {
        var map, infoWindow;
        var markers = [];
        
        // map config
        var mapOptions = {
            center: new google.maps.LatLng(50, 2),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        
        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
            }
        }    
        
        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
            
            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }
        
        // show the map and place some markers
        initMap();
        
        setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
        setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
        setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
    };
    
    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        link: link
    };	
});


