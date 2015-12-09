function Manipulator(buffer, width, height){
    this.buffer = buffer;

    this.width = width;
    this.height = height;
    this.isLittleEndian = true;

    this.buf8 = new Uint8ClampedArray(buffer); //VIEW OF PIXELS
    this.buf32 = new Uint32Array(buffer); //USES INTS.
    //CANT WRITE TO BUFFER.

    // All encoding of the image goes in here
    // see http://jsperf.com/canvas-pixel-manipulation for speed test
    this.encode = function(text){
        // PLACE ENCODING CODE BELOW HERE
        console.log("encoded! (not really yet...)");
    };

    this.decode = function(){

        console.log("decoded! (not really yet...)");
        var finalBinary;
        finalBinary = 101010101110;
        var finalString = '';


        console.log(parseInt(finalBinary,2).toString(10))

        //Need code to convert final binary into string. 
        var dv = [1,3,4];
        console.log(dv.toString());

    };

    /*
    TODO: 
        - LOOP OVER ARRAY OF PIXELS (UINT32)
        - GET LSB OF EACH PIXEL
        - RETURNS LSB OF EACH PIXEL
        - KEEP TRACK AND ADD, AND THEN OUTPUT THE STRING.
    */

    this.getEndianness = function() {
        // Determine whether Uint32 is little- or big-endian
        // https://en.wikipedia.org/wiki/Endianness
        var temp = this.buf32[1];
        this.buf32[0] = 0x0a0b0c0d;
        this.isLittleEndian = true;
        if (this.buf8[0] === 0x0a && this.buf8[1] === 0x0b && this.buf8[2] === 0x0c &&
            this.buf8[3] === 0x0d) {
            this.isLittleEndian = false;
        }
        // reset the change
        this.buf32[0] = temp;
    };
    this.getEndianness();

    // Sets the pixel at location (x,y) to the given RGBA value
    // assumes that the given (x,y) coordinate is within the image
    this.setPixel = function(x, y, r, g, b, a){
        if(this.isLittleEndian){
            this.buf32[y * width + x] = (a << 24) | (b << 16) | (g << 8) | r;
         } else {
            this.buf32[y * width + x] = (r << 24) | (g << 16) | (b << 8) | a;
         }
    };

    this.getLsb = function(x, y, colorIndex){
        /* add 0-2 for RGB respectively */
        if(colorIndex < 0 || colorIndex >= 3){ throw "Color index must be between 0 and 3 (R, G, or B respectively)";}

    }
}
