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

    this.decode = function() {

        console.log("decoded! (not really yet...)");
        var finalBinary;
        //replace this array with the incoming data.
        var array = [0,1,0,1,0,1,0,0,0,1,1,0,1,0,0,0,0,1,1,0,1,0,0,1,0,1,1,1,0,0,1,1,0,0,1,0,0,0,0,0,0,1,1,0,1,0,0,1,0,1,1,1,0,0,1,1,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,0,1,1,1,0,0,1,1,0,1,1,1,0,1,0,0,0,0,1,0,0,0,0,1];
        finalBinary = this.arrayToBinary(array)
        var finalString = '';


        console.log(''+ this.convertBinaryToString(finalBinary))

    };

    this.arrayToBinary = function (array) {
        var binaryString = '';
        var spacecount = 0;
        for (var i = 0; i < array.length; i++)
        {
            binaryString += array[i];
            spacecount++;
            if (spacecount == 8) {
                binaryString += " ";
                spacecount = 0;
            }

        }

        return binaryString;

    }

    this.convertBinaryToString = function(binary) {
        var returnValue = "";
        var res = binary.split(" ");
        for (var i = 0; i < res.length; i++) 
        {
            var value  = parseInt(res[i],2).toString(10);
            returnValue += String.fromCharCode(value);
        }
        return returnValue;
    }

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

    /// Sets the pixel at location (x,y) to the given RGBA value
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