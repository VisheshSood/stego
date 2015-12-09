angular.module("Stego", ["ui.router"])
    .config(function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state("encode", {
                url: "/encode",
                templateUrl: "views/encode.html",
                controller: "StegoController"
            })
            .state("decode", {
                url: "/decode",
                templateUrl: "views/decode.html",
                controller: "StegoController"
            })
            .state("landing", {
                url: "/welcome",
                templateUrl: "views/landing.html",
                controller: "StegoController"
            });
            $urlRouterProvider.otherwise("/welcome");
    })
    .controller("StegoController", function($scope, $state){
        console.log("Stego is up and running!");
        $scope.goHome = function() {
            $state.go('landing');
            console.log("going home!");
        }

        $scope.goToEncode = function() {
            $state.go('encode');
        }

        $scope.goToDecode = function() {
            $state.go('decode');
        }

    });

