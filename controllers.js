const fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true});

const IMG_PROP = {
    wheelWidth: 470,
    wheelHeight: 470,
    width: 800,
    height: 800,
    origWidth: 800,
    origHeight: 800,
    origFontSize: 35
};

exports.behaviorGraph = (req, res) => {
    var startTime = new Date();
    var gparams = parseParams(req.params.graphParams);
    var imgProp = Object.assign({}, IMG_PROP);

    imgProp.width = imgProp.width * gparams.scale;
    imgProp.height = imgProp.height * gparams.scale;

    res.set('Content-Type', 'image/png');

    var heightScalar = imgProp.height/imgProp.origHeight;
    var widthScalar = imgProp.width/imgProp.origWidth;
    imgProp.wheelHeight = imgProp.wheelHeight * heightScalar;
    imgProp.wheelWidth = imgProp.wheelWidth * widthScalar;
    if (imgProp.origWidth !== imgProp.width || imgProp.origHeight !== imgProp.height) {
        gparams.coords = translateCoords(imgProp, gparams.coords);
    }

    gm('img/mbtiBackground.png')
        .resize(imgProp.wheelWidth, imgProp.wheelHeight)
        .borderColor("white")
        .border((imgProp.width-imgProp.wheelWidth)/2,(imgProp.height-imgProp.wheelHeight)/2)
        .addLabels(imgProp)
        .stroke("rgba(0,0,0, 0.0)")
        .fill("rgba(0,0,0, 0.5)")
        .drawPolygon(gparams.coords[0], gparams.coords[1], gparams.coords[2], gparams.coords[3],
            gparams.coords[4], gparams.coords[5], gparams.coords[6], gparams.coords[7])
        .toBuffer('PNG', (err, bfr) => {
            res.send(bfr);
            var endTime = new Date();
            console.log("elapsed:",endTime-startTime,"ms");
        });
};

exports.traitGraph = (req, res) => {
    const origFontSize = 35;
    var startTime = new Date();
    var gparams = parseParams2(req.params.graphParams);
    console.log(gparams);
    var imgProp = Object.assign({}, IMG_PROP);

    imgProp.width = imgProp.width * gparams.scale;
    imgProp.height = imgProp.height * gparams.scale;

    res.set('Content-Type', 'image/png');

    var heightScalar = imgProp.height/imgProp.origHeight;
    var widthScalar = imgProp.width/imgProp.origWidth;
    imgProp.wheelHeight = imgProp.wheelHeight * heightScalar;
    imgProp.wheelWidth = imgProp.wheelWidth * widthScalar;
    if (imgProp.origWidth !== imgProp.width || imgProp.origHeight !== imgProp.height) {
        gparams.coords = translateCoords(imgProp, gparams.coords);
    }

    var adjustedFontSize = origFontSize * heightScalar;
    var dotRadius = 8;
    gm('img/mbtiBackground.png')
        .resize(imgProp.wheelWidth, imgProp.wheelHeight)
        .borderColor("white")
        .border((imgProp.width-imgProp.wheelWidth)/2,(imgProp.height-imgProp.wheelHeight)/2)
        .addLabels(imgProp)
        .stroke("rgba(0,0,0, 0.1)")
        .fill("rgba(0,0,0, 0.8)")
        .drawMultiDot(imgProp, gparams.coords)
        //.drawCircle(gparams.coords[0][0], gparams.coords[0][1], gparams.coords[0][0]-dotRadius, gparams.coords[0][1])
        .toBuffer('PNG', (err, bfr) => {
            res.send(bfr);
            var endTime = new Date();
            console.log("elapsed:",endTime-startTime,"ms");
        });
}

function parseParams(paramStr) {
    var parsed = {
        coords: [],
        scale: 1
    };
    //parameters are delimited by !
    var splt1 = paramStr.split('.')[0].split('!'); //throw away anything after a period, e.g. ".PNG"

    //if the last parameter does not contain a comma, it is not a coordinate and we treat it as a scalar
    if (splt1[splt1.length-1].indexOf(',') === -1) {
        parsed.scale = (splt1.pop() / 100);
    }
    for (var i = 0; i < splt1.length; i++) {
        parsed.coords.push(splt1[i].split(','));
    }

    return parsed;
}
function parseParams2(paramStr) {
    var parsed = {
        coords: [],
        scale: 1
    };
    //parameters are delimited by !
    var splt1 = paramStr.split('.')[0].split('!'); //throw away anything after a period, e.g. ".PNG"

    //if the last parameter does not contain a comma, it is not a coordinate and we treat it as a scalar
    if (splt1[splt1.length-1].indexOf(',') === -1) {
        parsed.scale = (splt1.pop() / 100);
    }
    for (var i = 0; i < splt1.length; i++) {
        var splt2 = splt1[i].split(',');
        parsed.coords.push({
            x: splt2[0],
            y: splt2[1]
        });
        switch (splt2.length) {
            case 5:
                parsed.coords[i].mark = splt2[4];
            case 4:
                parsed.coords[i].intensity = splt2[3].split('i').join('.');
            case 3:
                parsed.coords[i].radius = splt2[2];
                break;
        }
    }

    return parsed;
}

gm.prototype.drawMultiDot = function (imgProp, dots) {
    var heightScalar = imgProp.height / imgProp.origHeight;
    var widthScalar = imgProp.width / imgProp.origWidth;

    for (var i = 0; i < dots.length; i++) {
        if (dots[i].mark !== '1' && dots[i].intensity > 1) {
            this.stroke("rgba(0,0,0, 0.001)")
                .fill("rgba(0,0,0, "+((parseFloat(dots[i].intensity)+1)/10)*0.5+")")
                .drawCircle(dots[i].x, dots[i].y, parseFloat(dots[i].x)-dots[i].radius*0.8, dots[i].y);
            console.log(dots[i].radius);
        }
    }
    for (var i = 0; i < dots.length; i++) {
        if (dots[i].mark === '1') {
            this.stroke("rgba(255,255,0, 0.001)")
                .fill("rgba(255,255,0, 0.5)")
                .drawCircle(dots[i].x, dots[i].y, parseFloat(dots[i].x)-dots[i].radius*0.8, dots[i].y);
            console.log("yellow!",dots[i].radius);
        }
    }
    return this;
}

gm.prototype.addLabels = function (imgProp) {
    var heightScalar = imgProp.height / imgProp.origHeight;
    var widthScalar = imgProp.width / imgProp.origWidth;
    var adjustedFontSize = imgProp.origFontSize * heightScalar;

    this.font("Arial", adjustedFontSize)
        .stroke("rgba(0,0,0,0.1)")
        .fill("rgba(0,0,0, 0.8)")
        .drawText(
            (imgProp.width/2) - (38*widthScalar),
            (imgProp.height/2) - (imgProp.wheelHeight/2) - (20*heightScalar),
            "Eyes"
        )
        .drawText(
            (imgProp.width/2) - (46*widthScalar),
            (imgProp.height/2) - (imgProp.wheelHeight/2) - (75*heightScalar),
            "Vision"
        )
        .drawText(
            (imgProp.width/2) - (53*widthScalar),
            (imgProp.height/2) + (imgProp.wheelHeight/2) + (45*heightScalar),
            "Hands"
        )
        .drawText(
            (imgProp.width/2) - (78*widthScalar),
            (imgProp.height/2) + (imgProp.wheelHeight/2)+ (100*heightScalar),
            "Execution"
        )
        .draw([
            "rotate 90 text "
            +( (imgProp.height/2) -  (45*heightScalar) )
            +",-"
            +( (imgProp.width/2) + (imgProp.wheelWidth/2) + (20*widthScalar) )
            +" \"Heart\""
        ])
        .draw([
            "rotate 90 text "
            +( (imgProp.height/2) - (140*heightScalar) )
            +",-"
            +( (imgProp.width/2) + (imgProp.wheelWidth/2) + (70*widthScalar) )
            +" \"Human Interaction\""
        ])
        .draw([
            "rotate -90 text -"
            +Math.round( (imgProp.height/2) + (40*heightScalar) )
            +","
            +Math.round( (imgProp.width/2) - (imgProp.wheelWidth/2) - (20*widthScalar) )
            +" \"Brain\""
        ])
        .draw([
            "rotate -90 text -"
            +Math.round( (imgProp.height/2) + (145*heightScalar) )
            +","
            +Math.round( (imgProp.width/2) - (imgProp.wheelWidth/2) - (75*widthScalar) )
            +" \"Analysis & Design\""
        ])
        .font("Arial", 15*heightScalar)
        .stroke("rgba(255,0,0, 0.0)")
        .fill("rgba(255,0,0, 1)")
        .drawText(
            imgProp.width/2 - 30*widthScalar,
            imgProp.height/2 + 6*widthScalar,
            "Balanced"
        )
    return this;
}

function translateCoords(imgProp, coords) {
    var newCoords = [];
    var heightScalar = imgProp.height / imgProp.origHeight;
    var widthScalar = imgProp.width / imgProp.origWidth;
    for (var i = 0; i < coords.length; i++) {
        newCoords.push([
            coords[i][0]*widthScalar,
            coords[i][1]*heightScalar,
        ]);
    }
    return newCoords;
}
