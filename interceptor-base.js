function baseInterceptor() {
  this.prevTotalCount =  0,
  this.totalCount =  0,
  this.currentColor =  'white',
  this.bgColor =  'white',
  this.objectArea =  0,
  this.coordinates =  [],
  this.objectDescription =  '',
  this.canvasDetails =  {
    width: 0,
    height: 0
  },
  this.setupObject = {
    objectArray: [],
    objectCount: 0,
    objectTypeCount: {}
  },
  this.drawObject = {
    objectArray: [],
    objectCount: 0,
    objectTypeCount: {}
  },
  this.isCleared = false,

  this.getColorName = function(arguments) {
    if (arguments.length == 3) {
      // assuming that we are doing RGB - convert RGB values to a name
      var color = '#' + arguments[0].toString(16).paddingLeft('00')
        + arguments[1].toString(16).paddingLeft('00')
        + arguments[2].toString(16).paddingLeft('00');
      var nMatch = ntc.name(color);
      var rgb = '(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ')';
      return ({
        'color': nMatch[1],
        'rgb': rgb
      });
    } else if (arguments.length == 1) {
      if (!(typeof(arguments[0])).localeCompare('number')) {
        // assuming that we are doing RGB - this would be a grayscale number
        if (arguments[0] < 10) {
          var rgb = '(0,0,0)';
          return ({
            'color': 'black',
            'rgb': rgb
          });
        } else if (arguments[0] > 240) {
          var rgb = '(255,255,255)';
          return ({
            'color': 'white',
            'rgb': rgb
          });
        } else {
          var rgb = '(' + arguments[0] + ',' + arguments[0] + ',' + arguments[0] + ')';
          return ({
            'color': 'grey',
            'rgb': rgb
          });
        }
      } else if (!(typeof(arguments[0])).localeCompare('string')) {
        if (!arguments[0].charAt(0).localeCompare('#')) {
          // if user has entered a hex color
          var nMatch = ntc.name(arguments[0]);
          return ({
            'color': nMatch[1]
          });
        } else {
          return ({
            'color': arguments[0]
          });
        }
      }
    }
  }

  this.getObjectArea = function(objectType, arguments) {
    var objectArea = 0;
    if (!objectType.localeCompare('arc')) {
      objectArea = 0;
    } else if (!objectType.localeCompare('ellipse')) {
      objectArea = 3.14 * arguments[2] * arguments[3] / 4;
    } else if (!objectType.localeCompare('line')) {
      objectArea = 0;
    } else if (!objectType.localeCompare('point')) {
      objectArea = 0;
    } else if (!objectType.localeCompare('quad')) {
      // x1y2+x2y3+x3y4+x4y1−x2y1−x3y2−x4y3−x1y4
      objectArea = (arguments[0] * arguments[1] + arguments[2] * arguments[3]
        + arguments[4] * arguments[5] + arguments[6] * arguments[7])
        - (arguments[2] * arguments[1] + arguments[4] * arguments[3]
        + arguments[6] * arguments[5] + arguments[0] * arguments[7]);
    } else if (!objectType.localeCompare('rect')) {
      objectArea = arguments[2] * arguments[3];
    } else if (!objectType.localeCompare('triangle')) {
      objectArea = abs(arguments[0] * (arguments[3] - arguments[5]) + arguments[2] * (arguments[5] - arguments[1])
      + arguments[4] * (arguments[1] - arguments[3]));
      // Ax( By −	Cy) +	Bx(Cy −	Ay) +	Cx(Ay −	By )
    }
    return objectArea;
  }

  /* return which part of the canvas an object os present */
  this.canvasAreaLocation = function(x, arguments, canvasX, canvasY) { // eslint-disable-line
    var xCoord, yCoord;
    for (var i = 0; i < arguments.length; i++) {
      a = arguments[i];
      if (x.params[i].description.indexOf('x-coordinate') > -1) {
        xCoord = a;
      } else if (x.params[i].description.indexOf('y-coordinate') > -1) {
        yCoord = a;
      }
    }

    if (xCoord < 0.4 * canvasX) {
      if (yCoord < 0.4 * canvasY) {
        return 'top left';
      } else if (yCoord > 0.6 * canvasY) {
        return 'bottom left';
      } else {
        return 'mid left';
      }
    } else if (xCoord > 0.6 * canvasX) {
      if (yCoord < 0.4 * canvasY) {
        return 'top right';
      } else if (yCoord > 0.6 * canvasY) {
        return 'bottom right';
      } else {
        return 'mid right';
      }
    } else {
      if (yCoord < 0.4 * canvasY) {
        return 'top middle';
      } else if (yCoord > 0.6 * canvasY) {
        return 'bottom middle';
      } else {
        return 'middle';
      }
    }
  }

}
