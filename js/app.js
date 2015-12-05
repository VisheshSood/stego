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
    .controller("StegoController", function($scope){
        "use strict";

        $scope.submitForm = function(){
            var file = document.getElementById("imageInput").files[0];
            if(file){
                var read = new FileReader();
                read.onloadend = function(e){
                    //get the url result
                    var data = read.result
                    // put that url in an img tag (may not be necessary?)
                    var imageElement = document.createElement("img");
                    imageElement.setAttribute("src", data);
                    console.log(imageElement);
                    // put that image into a canvas
                    var canvas = document.createElement('canvas');
                    canvas.setAttribute("width", imageElement.width);
                    canvas.setAttribute("height", imageElement.height);
                    var context = canvas.getContext('2d');
                    context.drawImage(imageElement, 0, 0 );
                    var rawData = context.getImageData(0,0,imageElement.width, imageElement.height);
                    // read in the data as arrays
                    var buf8 = new Uint8ClampedArray(rawData);
                    console.log(buf8);
                    var buf32 = new Uint32Array(rawData);
                    console.log(buf32);
                }
                read.readAsDataURL(file);
                console.log("reading file");
            }
        }
    });
