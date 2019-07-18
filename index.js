var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});

// resize and remove EXIF profile data
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
