import { epsilon } from "./math";
import { geoAlbers as albers } from "d3-geo";
import { fitExtent, fitSize } from "./fit";
import { path } from "d3-path";

function multiplex(streams) {
  var n = streams.length;
  return {
    point: function(x, y) {
      var i = -1;
      while (++i < n) streams[i].point(x, y);
    },
    sphere: function() {
      var i = -1;
      while (++i < n) streams[i].sphere();
    },
    lineStart: function() {
      var i = -1;
      while (++i < n) streams[i].lineStart();
    },
    lineEnd: function() {
      var i = -1;
      while (++i < n) streams[i].lineEnd();
    },
    polygonStart: function() {
      var i = -1;
      while (++i < n) streams[i].polygonStart();
    },
    polygonEnd: function() {
      var i = -1;
      while (++i < n) streams[i].polygonEnd();
    }
  };
}

export default function() {
  var cache,
    cacheStream,
    main = albers()
      .rotate([4.4, 0.8])
      .center([0, 55.4])
      .parallels([50, 60]),
    mainPoint,
    shetland = albers()
      .rotate([4.4, 0.8])
      .center([0, 55.4])
      .parallels([50, 60]),
    shetlandPoint,
    point,
    pointStream = {
      point: function(x, y) {
        point = [x, y];
      }
    };

  var shetlandBbox = [
    [-2.1, 70],
    [-0.7, 59.8]
  ];
  function albersUk(coordinates) {
    var x = coordinates[0],
      y = coordinates[1];
    return (
      (point = null),
      (mainPoint.point(x, y), point) || (shetlandPoint.point(x, y), point)
    );
  }

  albersUk.invert = function(coordinates) {
    var k = main.scale(),
      t = main.translate(),
      x = (coordinates[0] - t[0]) / k,
      y = (coordinates[1] - t[1]) / k;

    return (y >= -0.089 && y < 0.06 && x >= 0.029 && x < 0.046
      ? shetland
      : main
    ).invert(coordinates);
  };

  albersUk.stream = function(stream) {
    return cache && cacheStream === stream
      ? cache
      : (cache = multiplex([
          main.stream((cacheStream = stream)),
          shetland.stream(stream)
        ]));
  };

  albersUk.precision = function(_) {
    if (!arguments.length) return main.precision();
    main.precision(_), shetland.precision(_);
    return reset();
  };

  albersUk.scale = function(_) {
    if (!arguments.length) return main.scale();
    main.scale(_), shetland.scale(_);
    return albersUk.translate(main.translate());
  };

  albersUk.translate = function(_) {
    if (!arguments.length) return main.translate();
    var k = main.scale(),
      x = +_[0],
      y = +_[1];

    mainPoint = main
      .translate(_)
      .clipExtent([
        [x - 0.065 * k, y - 0.089 * k],
        [x + 0.075 * k, y + 0.089 * k]
      ])
      .stream(pointStream);

    shetlandPoint = shetland
      .translate([x + 0.01 * k, y + 0.025 * k])
      .clipExtent([
        [x + 0.029 * k + epsilon, y - 0.089 * k + epsilon],
        [x + 0.046 * k - epsilon, y - 0.06 * k - epsilon]
      ])
      .stream(pointStream);

    return reset();
  };

  albersUk.fitExtent = function(extent, object) {
    return fitExtent(albersUk, extent, object);
  };

  albersUk.fitSize = function(size, object) {
    return fitSize(albersUk, size, object);
  };

  function reset() {
    cache = cacheStream = null;
    return albersUk;
  }

  albersUk.drawCompositionBorders = function(context) {
    /*var ul = main.invert([
      shetland.clipExtent()[0][0],
      shetland.clipExtent()[0][1]
    ]);
    var ur = main.invert([
      shetland.clipExtent()[1][0],
      shetland.clipExtent()[0][1]
    ]);
    var ld = main.invert([
      shetland.clipExtent()[1][0],
      shetland.clipExtent()[1][1]
    ]);
    var ll = main.invert([
      shetland.clipExtent()[0][0],
      shetland.clipExtent()[1][1]
    ]);

    console.log("ul = main([" + ul + "]);");
    console.log("ur = main([" + ur + "]);");
    console.log("ld = main([" + ld + "]);");
    console.log("ll = main([" + ll + "]);");

    console.log("context.moveTo(ul[0], ul[1]);");
    console.log("context.lineTo(ur[0], ur[1]);");
    console.log("context.lineTo(ld[0], ld[1]);");
    console.log("context.lineTo(ll[0], ll[1]);");
    console.log("context.closePath();");*/

    var ul, ur, ld, ll;
    ul = main([-1.113205870242365, 59.64920050773357]);
    ur = main([0.807899092399606, 59.59085836472269]);
    ld = main([0.5778611961420386, 57.93467822832577]);
    ll = main([-1.25867782078448, 57.99029450085142]);
    context.moveTo(ul[0], ul[1]);
    context.lineTo(ur[0], ur[1]);
    context.lineTo(ld[0], ld[1]);
    context.lineTo(ll[0], ll[1]);
    context.closePath();
  };
  albersUk.getCompositionBorders = function() {
    var context = path();
    this.drawCompositionBorders(context);
    return context.toString();
  };

  return albersUk.scale(2800);
}
