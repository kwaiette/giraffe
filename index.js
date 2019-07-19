const express = require('express');
const app = express();
const port = 3100;
const fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true});
//const controllers = require('controllers.js');

const IMG_PROP = {
    wheelWidth: 470,
    wheelHeight: 470,
    width: 800,
    height: 800,
    origWidth: 800,
    origHeight: 800
};

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/grf/behavior/:graphParams', (req, res) => {
    const origFontSize = 35;
    var startTime = new Date();
    var gparams = [];
    var overallScale = 1;
    var imgProp = Object.assign({}, IMG_PROP);
    var splt1 = req.params.graphParams.split('.')[0].split('!'); //throw away anything after a period, e.g. ".PNG"
    if (splt1.length % 2 === 0) {
        console.log("aaaaaaaaaaaaaaaaaaa",splt1.length, splt1)
        overallScale = (splt1.pop() / 100);
    }
    imgProp.width = imgProp.width * overallScale;
    imgProp.height = imgProp.height * overallScale;

    for (var i = 0; i < splt1.length; i++) {
        gparams.push(splt1[i].split(','));
    }
    console.log(gparams);
    res.set('Content-Type', 'image/png');

    var heightScalar = imgProp.height/imgProp.origHeight;
    var widthScalar = imgProp.width/imgProp.origWidth;
    imgProp.wheelHeight = imgProp.wheelHeight * heightScalar;
    imgProp.wheelWidth = imgProp.wheelWidth * widthScalar;
    if (imgProp.origWidth !== imgProp.width || imgProp.origHeight !== imgProp.height) {
        gparams = translateCoords(imgProp, gparams);
    }

    var adjustedFontSize = origFontSize * heightScalar;
    gm('img/mbtiBackground.png')
        .resize(imgProp.wheelWidth, imgProp.wheelHeight)
        .borderColor("white")
        .border((imgProp.width-imgProp.wheelWidth)/2,(imgProp.height-imgProp.wheelHeight)/2)
        .font("Arial", adjustedFontSize)
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
        //drawText(ctx, "red", "Balanced", "15px Arial", 370, 406);
        .font("Arial", 15*heightScalar)
        .stroke("rgba(255,0,0, 0.0)")
        .fill("rgba(255,0,0, 1)")
        .drawText(
            imgProp.width/2 - 30*widthScalar,
            imgProp.height/2 + 6*widthScalar,
            "Balanced"
        )
        .stroke("rgba(0,0,0, 0.0)")
        .fill("rgba(0,0,0, 0.5)")
        .drawPolygon(gparams[0], gparams[1], gparams[2], gparams[3], gparams[4], gparams[5], gparams[6], gparams[7])
        .toBuffer('PNG', (err, bfr) => {
            res.send(bfr);
            var endTime = new Date();
            console.log("elapsed:",endTime-startTime,"ms");
        });
    /*
    res.send(
        'which: ' + req.params.which + '<br /> ' +
        'params: ' + req.params.graphParams + '<br /> ' +
        'pp: ' + JSON.stringify(JSON.parse('['+req.params.graphParams+']'))
    );
    */
});
app.get('/grf/traits/:graphParams', (req, res) => {
    const origFontSize = 35;
    var startTime = new Date();
    var gparams = [];
    var splt1 = req.params.graphParams.split('.')[0].split('!'); //throw away anything after a period, e.g. ".PNG"
    for (var i = 0; i < splt1.length; i++) {
        gparams.push(splt1[i].split(','));
    }
    console.log(gparams);
    res.set('Content-Type', 'image/png');

    var heightScalar = imgProp.height/imgProp.origHeight;
    var widthScalar = imgProp.width/imgProp.origWidth;
    imgProp.wheelHeight = imgProp.wheelHeight * heightScalar;
    imgProp.wheelWidth = imgProp.wheelWidth * widthScalar;
    if (imgProp.origWidth !== imgProp.width || imgProp.origHeight !== imgProp.height) {
        gparams = translateCoords(imgProp, gparams);
    }

    var adjustedFontSize = origFontSize * heightScalar;
    var dotRadius = 8;
    gm('img/mbtiBackground.png')
        .resize(imgProp.wheelWidth, imgProp.wheelHeight)
        .borderColor("white")
        .border((imgProp.width-imgProp.wheelWidth)/2,(imgProp.height-imgProp.wheelHeight)/2)
        .font("Arial", adjustedFontSize)
        .stroke("rgba(0,0,0, 0.1)")
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
        //drawText(ctx, "red", "Balanced", "15px Arial", 370, 406);
        .font("Arial", 15*heightScalar)
        .stroke("rgba(255,0,0, 0.0)")
        .fill("rgba(255,0,0, 1)")
        .drawText(
            imgProp.width/2 - 30*widthScalar,
            imgProp.height/2 + 6*widthScalar,
            "Balanced"
        )
        .stroke("rgba(0,0,0, 0.1)")
        .fill("rgba(0,0,0, 0.8)")
        .drawCircle(gparams[0][0], gparams[0][1], gparams[0][0]-dotRadius, gparams[0][1])
        .toBuffer('PNG', (err, bfr) => {
            res.send(bfr);
            var endTime = new Date();
            console.log(gparams[0][0], gparams[0][1], parseInt(gparams[0][0])-dotRadius, gparams[0][1]);
            console.log("elapsed:",endTime-startTime,"ms");
        });
    /*
    res.send(
        'which: ' + req.params.which + '<br /> ' +
        'params: ' + req.params.graphParams + '<br /> ' +
        'pp: ' + JSON.stringify(JSON.parse('['+req.params.graphParams+']'))
    );
    */
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

/*
gm('img/mbtiBackground.png')
	//.resize(800, 800)
	.borderColor("white")
	.border(90,90)
	.stroke("rgba(0,0,0, 0.7)")
	.fill("rgba(0,0,0, 0.5)")
	.drawPolygon([100, 20], [63, 126], [205, 106], [150, 20])
	.font("Arial", 35)
	.stroke("black")
	.drawText(362,155, "Eyes")
	.drawText(354,100, "Vision")
	.drawText(347,670, "Hands")
    .drawText(322,725, "Execution")
	.write("img/mod.png", function(err) {
		console.log("done");
	});
*/
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
