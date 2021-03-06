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
        "use strict";

        $scope.doneProcessing = false;
        $scope.encode = function(){
            var file = document.getElementById("image-input").files[0];
            if(file){
                var read = new FileReader();
                read.onloadend = function(e){
                    $scope.doneProcessing = true;
                    //get the url result
                    var result = read.result;
                    // put that url in an img element
                    var imageElement = document.createElement("img");
                    imageElement.setAttribute("src", result);

                    // put that image into a canvas
                    var canvas = document.createElement('canvas');
                    canvas.setAttribute("width", imageElement.naturalWidth);
                    canvas.setAttribute("height", imageElement.naturalHeight);
                    var context = canvas.getContext('2d');
                    context.drawImage(imageElement, 0, 0);
                    var rawData = context.getImageData(0, 0, canvas.width, canvas.height);
                    // getting a reference to the data to speed up references
                    var data = rawData.data;
                    var manipulator = new Manipulator(data.buffer, canvas.width, canvas.height);
                    manipulator.encode(document.getElementById("encoding-text").value);
                    rawData.data.set(manipulator.buf8);
                    context.putImageData(rawData, 0, 0);
                    document.getElementById("output-image").setAttribute("src", canvas.toDataURL().toString());
                    $scope.doneProcessing = true;
                };
                read.readAsDataURL(file);
            }
        };

        $scope.decode = function () {
            var file = document.getElementById("image-input").files[0];
            if(file){
                var read = new FileReader();
                read.onloadend = function(e){
                    //get the url result
                    var result = read.result;
                    // put that url in an img element
                    var imageElement = document.createElement("img");
                    imageElement.setAttribute("src", result);

                    // put that image into a canvas
                    var canvas = document.createElement('canvas');
                    canvas.setAttribute("width", imageElement.naturalWidth);
                    canvas.setAttribute("height", imageElement.naturalHeight);
                    var context = canvas.getContext('2d');
                    context.drawImage(imageElement, 0, 0);
                    var rawData = context.getImageData(0, 0, canvas.width, canvas.height);
                    // getting a reference to the data to speed up references
                    var data = rawData.data;
                    var manipulator = new Manipulator(data.buffer, canvas.width, canvas.height);
                    var output = manipulator.decode();
                    rawData.data.set(manipulator.buf8);
                    context.putImageData(rawData, 0, 0);
                    document.getElementById("output-text").innerHTML = output;
                    $scope.loading = false;
                };
                $scope.loading = true;
                read.readAsDataURL(file);
            }
        };

        $scope.goHome = function() {
            $state.go('landing');
        };

        $scope.goToEncode = function() {
            $state.go('encode');
        };

        $scope.goToDecode = function() {
            $state.go('decode');
        };
    });
