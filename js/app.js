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
                    var buffer = new ArrayBuffer(rawData.data.length);

                    // read in the data as arrays.
                    var buf8 = new Uint8ClampedArray(buffer);
                    var buf32 = new Uint32Array(buffer);
                    // Determine whether Uint32 is little- or big-endian.
                    buf32[1] = 0x0a0b0c0d;

                    var isLittleEndian = true;
                    if (buf8[4] === 0x0a && buf8[5] === 0x0b && buf8[6] === 0x0c &&
                        buf8[7] === 0x0d) {
                        isLittleEndian = false;
                    }
                    // reset the change
                    buf32[1] = 0;
                    encode(buf32, isLittleEndian);
                    rawData.data.set(buf8);
                    context.putImageData(rawData, 0, 0);
                    console.log("Output: (RGBA format)");
                    console.log(rawData.data);
                    $scope.loading = false;
                }
                $scope.loading = true;
                read.readAsDataURL(file);
            }
        }

        // All encoding of the image goes in here. ONLY use bitshift operators
        // see http://jsperf.com/canvas-pixel-manipulation for speed test
        function encode(array32, isLittleEndian){
            // example manipulation
            if(isLittleEndian){
                array32[0] =
                (255   << 24) |    // alpha
                (113 << 16) |    // blue
                (112 <<  8) |    // green
                111;            //red
             } else {
                array32[0] =
                (111   << 24) |  // red
                (112 << 16) |    // green
                (113 <<  8) |    // blue
                255;             //alpha
             }
        }
    });
