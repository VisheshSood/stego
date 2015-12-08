function Manipulator(data, width, height, isLittleEndian){
    this.data = data;
    this.width = width;
    this.height = height;
    this.isLittleEndian = isLittleEndian;

    // All encoding of the image goes in here
    // see http://jsperf.com/canvas-pixel-manipulation for speed test
    this.encode = function(text){
        // PLACE ENCODING CODE BELOW HERE
        console.log("encoded! (not really yet...)");
    }

    this.decode = function(){
        console.log("decoded! (not really yet...)");
    }

    // Sets the pixel at location (x,y) to the given RGBA value
    // assumes that the given (x,y) coordinate is within the image
    this.setPixel = function(x, y, r, g, b, a){
        if(isLittleEndian){
            this.data[y * width + x] = (a << 24) | (b << 16) | (g << 8) | r;
         } else {
            this.data[y * width + x] = (r << 24) | (g << 16) | (b << 8) | a;
         }
    }

    // gets the pixel at the given (x,y) coordinate
    // assumes that the given (x,y) coordinate is within the image
    this.getPixel = function(x, y){
        return this.data[y * width + x];
    }
    this.getPixel = function(index){
        return this.data[index];
    }

    this.getRedLsb = function(x,y){
        return getPixel(x,y) & 1;
    }
}
