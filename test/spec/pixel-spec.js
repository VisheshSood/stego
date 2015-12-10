describe("raw pixel manipulation functions", function(){
    var manipulator;
    var zerozero = 4278190080;
    var zeroone = 4278256127;
    var onezero = 4278320897;
    var oneone = 4294967295;

    beforeEach(function(){
        var size = 16;
        var buffer = new ArrayBuffer(size);
        var buf32 = new Uint32Array(buffer);
        buf32[0] = zerozero;
        buf32[1] = zeroone;
        buf32[2] = onezero;
        buf32[3] = oneone;
        console.log(buf32);
        manipulator = new Manipulator(buf32, 2, 2, true);
    });

    it("should return the proper Least Signifigant bit", function(){

    });
/*
    it("should return the right pixel value", function(){
        expect(manipulator.getPixel(0)).toEqual(zerozero);
        expect(manipulator.getPixel(1)).toEqual(zeroone);
        expect(manipulator.getPixel(2)).toEqual(onezero);
        expect(manipulator.getPixel(3)).toEqual(oneone);
    });
*/
    it("should set the right pixel value", function(){

    });

    it("decodes an image", function() {

    })

    it("converts an array of bits into appropriate bytes", function() {
        var array = [0,1,0,1,0,1,0,0,0,1,1,0,1,0,0,0,0,1,1,0,1,0,0,1,0,1,1,1,0,0,1,1,0,0,1,0,0,0,0,0,0,1,1,0,1,0,0,1,0,1,1,1,0,0,1,1,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,0,1,1,1,0,0,1,1,0,1,1,1,0,1,0,0,0,0,1,0,0,0,0,1];
        var value =  manipulator.arrayToBinary(array);
        expect(value).toEqual('01010100 01101000 01101001 01110011 00100000 01101001 01110011 00100000 01100001 00100000 01110100 01100101 01110011 01110100 00100001 ');
    })

    it("decodes the bits into string", function() {
        var string = '01000001';
        var value = manipulator.convertBinaryToString(string);
        expect(value).toEqual('A');
        var string = '' + '01010100 01101000 01101001 01110011 00100000 01101001 01110011 00100000 01100001 00100000 01110100 01100101 01110011 01110100 00100001';
        var value = manipulator.convertBinaryToString(string);
        expect(value).toEqual('This is a test!');

    })  
})
