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
            var bits = [];
            // 48 is the char code for 0, 49 for 1
            // puts in a number 1 or 0 based on the string "1" or "0"
            bits.push(binary.charCodeAt(index) === 48 ? 0 : 1);
            bits.push(binary.charCodeAt(index + 1) === 48 ? 0 : 1);
            bits.push(binary.charCodeAt(index + 2) === 48 ? 0 : 1);

            this.setLsb(pixelIndex, bits);
            pixelIndex++;
        }
        // set the LSB of all remaining pixels to 0, causing them to output
        // nothing when decoding
        for(pixelIndex; pixelIndex < this.buf32.length; pixelIndex++){
            this.setLsb(pixelIndex, [0,0,0]);
        }
    };

    /*
    Decodes the buffer stored in memory for the PixelManipulator
    */
    this.decode = function() {
        var finalBinary;
        var finalArray = [];
        var i = 0;
        for (i; i < this.buf32.length; i++) {
            var tempArray = this.getLsb(i);
            var j = 0;
            for (j; j < tempArray.length; j++) {
                finalArray.push(tempArray[j]);
            }
        }
        finalBinary = this.arrayToBinary(finalArray);
        return this.convertBinaryToString(finalBinary);
    };

    /*
    Converts a given string to a binary string
    */
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

    /*
    Converts the binary array given back to a string
    */
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
                // clear bit, making it 0
                this.buf32[index] &= ~(1 << i * 8);
            } else {
                // or bit, making it a 1
                this.buf32[index] |= 1 << (i * 8);
            }
        }
    };

    /*
     gets the LSB of each of the 3 color channels.
     Returns an array of 3 1's or 0's representing the 3 LSBs
    */
    this.getLsb = function(index){
        var result = [];
        // &'ing with 1 will return the LSB
        // red
        result.push((this.buf32[index]) & 1);
        // blue
        result.push((this.buf32[index] >> 8) & 1);
        // green
        result.push((this.buf32[index] >> 16) & 1);
        return result;
    };
}
