function Manipulator(buffer, width, height){
    this.buffer = buffer;

    this.width = width;
    this.height = height;
    this.buf8 = new Uint8ClampedArray(buffer);
    this.buf32 = new Uint32Array(buffer);
    this.isLittleEndian = true;
    this.getEndianness = function() {
        // Determine whether Uint32 is little- or big-endian
        // https://en.wikipedia.org/wiki/Endianness
        var temp = this.buf32[1];
        this.buf32[0] = 0x0a0b0c0d;
        this.isLittleEndian = !(this.buf8[0] === 0x0a && this.buf8[1] === 0x0b && this.buf8[2] === 0x0c &&
                                this.buf8[3] === 0x0d);
        // reset the change
        this.buf32[0] = temp;
        console.log(this.isLittleEndian);
    };
    this.getEndianness();


    // All encoding of the image goes in here
    // see http://jsperf.com/canvas-pixel-manipulation for speed test
    this.encode = function(text){
        // PLACE ENCODING CODE BELOW HERE
        console.log("buf8:");
        console.log(this.buf8);
        console.log("buf32:");
        console.log(this.buf32);
        console.log("encoded! (not really yet...)");
    };

    this.decode = function(){
        console.log("decoded! (not really yet...)");
    };

    // Sets the pixel at location (x,y) to the given RGBA value
    // assumes that the given (x,y) coordinate is within the image
    this.setPixel = function(index, r, g, b, a){
        if(this.isLittleEndian){
            this.buf32[index] = (a << 24) | (b << 16) | (g << 8) | r;
         } else {
            this.buf32[index] = (r << 24) | (g << 16) | (b << 8) | a;
         }
    };

    /* Sets the lsb of the pixel at the given index with the given array of 3 bits */
    this.setLsb = function(index, bits){
        /* ------- Error checking omitted for speed reasons
        if(bits.length > 3){ throw "Can only insert 3 bits at a time."; }
        */

    };

    this.getPixel = function(index){
        return this.buf32[index];
    }

    this.getLsb = function(index){
        var result = [];
        // red
        result.push((this.buf32[index]) & 1);
        // blue
        result.push((this.buf32[index] >> 8) & 1);
        // green
        result.push((this.buf32[index] >> 16) & 1);
        return result;
    };

    this.getLsbColor = function(index, colorIndex){
        /*  ------ Error checking omitted for speed reasons
        // add 0-2 for RGB respectively
        if(colorIndex < 0 || colorIndex >= 3){ throw "Color index must be between 0 and 3 (R, G, or B respectively)";}
        */
        console.log("got lsb of: "+this.buf8[index * 4 + colorIndex] + " as: "+this.buf8[index * 4 + colorIndex] & 1);
        return this.buf8[index * 4 + colorIndex] & 1;
    };
}
