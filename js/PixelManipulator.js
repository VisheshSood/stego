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
        var temp = this.buf32[0];
        this.buf32[0] = 0x0a0b0c0d;
        this.isLittleEndian = !(this.buf8[0] === 0x0a && this.buf8[1] === 0x0b && this.buf8[2] === 0x0c &&
                                this.buf8[3] === 0x0d);
        // reset the change
        this.buf32[0] = temp;
    };
    this.getEndianness();

    // All encoding of the image goes in here
    // see http://jsperf.com/canvas-pixel-manipulation for speed test
    this.encode = function(text){
        var index = 0;
        var binary = "";
        for(index; index < text.length; index++){
            // should optimize this so we don't allocate new strings all the time
            binary += this.stringToBinary(text.charCodeAt(index));
        }
        // pad extra 0's till binary is a multiple of 3
        if(binary.length % 3 !== 0){
            var inner = 0;
            for(inner; inner < binary.length % 3; inner++){
                binary += "0";
            }
        }
        // actually encode the string
        index = 0;
        var pixelIndex = 0;
        for(index; index < binary.length; index+=3) {
            this.setLsb(pixelIndex, [binary.charCodeAt(index),
                                    binary.charCodeAt(index + 1),
                                    binary.charCodeAt(index + 2)]);
            pixelIndex++;
        }
    };

    this.decode = function() {
        console.log("decoded! (not really yet...)");
        var finalBinary;
        //iterate over buf32
        //replace this array with the incoming data.
        var array = [0,1,0,1,0,1,0,0,0,1,1,0,1,0,0,0,0,1,1,0,1,0,0,1,0,1,1,1,0,0,1,1,0,0,1,0,0,0,0,0,0,1,1,0,1,0,0,1,0,1,1,1,0,0,1,1,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,0,1,1,1,0,0,1,1,0,1,1,1,0,1,0,0,0,0,1,0,0,0,0,1];
        finalBinary = this.arrayToBinary(array);
        var finalString = '';
        console.log(''+ this.convertBinaryToString(finalBinary))

    };

    this.stringToBinary = function(charcode) {
        var padded = "00000000";
        // pad the values if necessary (usually is necessary)
        var unpaddedBin = charcode.toString(2);
        return padded.substring(0, 8 - unpaddedBin.length) + unpaddedBin;
    };

    this.arrayToBinary = function (array) {
        var binaryString = '';
        var spacecount = 0;
        for (var i = 0; i < array.length; i++) {
            binaryString += array[i];
            spacecount++;
            if (spacecount == 8) {
                binaryString += " ";
                spacecount = 0;
            }
        }
        return binaryString;
    };

    this.convertBinaryToString = function(binary) {
        var returnValue = "";
        var res = binary.split(" ");
        for (var i = 0; i < res.length; i++) 
        {
            var value  = parseInt(res[i],2).toString(10);
            returnValue += String.fromCharCode(value);
        }
        return returnValue;
    };

    /// Sets the pixel at location (x,y) to the given RGBA value
    // assumes that the given (x,y) coordinate is within the image
    this.setPixel = function(index, r, g, b, a){
        if(this.isLittleEndian){
            this.buf32[index] = (a << 24) | (b << 16) | (g << 8) | r;
         } else {
            this.buf32[index] = (r << 24) | (g << 16) | (b << 8) | a;
         }
    };

    /* Sets the lsb of the pixel at the given index with the given array of bits */
    this.setLsb = function(index, bits){
        var i = 0;
        for(i; i < bits.length; i++){
            // for once I actually want == not ===
            if(bits[i] == 0){
                // clear bit
                this.buf32[index] &= ~(1 << i * 8);
            } else {
                // or bit
                this.buf32[index] |= 1 << (i * 8);
            }
        }
    };

    /*
        Returns the RGBA representation of the pixel at the given index
    */
    this.getPixel = function(index){
        index *= 4;
        return [this.buf8[index], this.buf8[index+1], this.buf8[index+2], this.buf8[index+3]];
    };


    this.getPixel = function(index){
        return this.buf32[index];
    };

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
