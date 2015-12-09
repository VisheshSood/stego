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

        $scope.loading = false;

        $scope.submitForm = function(){
            var file = document.getElementById("imageInput").files[0];
            if(file){
                var read = new FileReader();
                read.onloadend = function(e){
                    //get the url result
                    var data = read.result
                    // put that url in an img element
                    var imageElement = document.createElement("img");
                    imageElement.setAttribute("src", data);

                    // put that image into a canvas
                    var canvas = document.createElement('canvas');
                    canvas.setAttribute("width", imageElement.naturalWidth);
                    canvas.setAttribute("height", imageElement.naturalHeight);
                    var context = canvas.getContext('2d');
                    context.drawImage(imageElement, 0, 0);
                    var rawData = context.getImageData(0, 0, canvas.width, canvas.height);
                    // getting a reference to the data to speed up references
                    var data = rawData.data;
                    console.log(data);

                    var manipulator = new Manipulator(data, canvas.width, canvas.height);
                    manipulator.encode("test");
                    rawData.data.set(manipulator.buf8);
                    context.putImageData(rawData, 0, 0);
                    console.log("Output: (RGBA format)");
                    console.log(data);
                    $scope.loading = false;
                };
                $scope.loading = true;
                read.readAsDataURL(file);
            }
        }
    });
