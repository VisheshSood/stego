describe("raw pixel manipulation functions", function(){
    var manipulator;
    //(0,0,0, 255)
    var zerozero = 4278190335;
    //(255,0,0, 155)
    var zeroone = 4278190335;
    //(0,255,0, 255)
    var onezero = 4278255360;
    //(255,255,255, 255)
    var oneone = 4294967295;

    beforeEach(function(){
        var size = 16;
        var buffer = new ArrayBuffer(size);
        var buf32 = new Uint32Array(buffer);
        buf32[0] = zerozero;
        buf32[1] = zeroone;
        buf32[2] = onezero;
        buf32[3] = oneone;
        manipulator = new Manipulator(buffer, 2, 2, true);
    });

    it("should return the proper Least Signifigant bit", function(){
        var arr = manipulator.getLsb(0);
        expect(arr).toEqual([1,0,0]);
        arr = manipulator.getLsb(1);
        expect(arr).toEqual([1,0,0]);
        arr = manipulator.getLsb(2);
        expect(arr).toEqual([0,1,0]);
        arr = manipulator.getLsb(3);
        expect(arr).toEqual([1,1,1]);
    });

    it("should return the right pixel value", function(){
        expect(manipulator.getPixel(0)).toEqual([0,0,0,255]);
        expect(manipulator.getPixel(1)).toEqual([255,0,0,255]);
        expect(manipulator.getPixel(2)).toEqual([0,255,0,255]);
        expect(manipulator.getPixel(3)).toEqual([255,255,255,255]);
    });

    it("should set the right pixel value", function(){

    });
});
