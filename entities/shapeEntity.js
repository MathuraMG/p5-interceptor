function ShapeEntity(shapeObject,arguments, canvasX, canvasY) {
  var self = this;
  BaseEntity.call(self,shapeObject,arguments, canvasX, canvasY);
  this.area = 0;

  this.populate = function(shapeObject, arguments, canvasX, canvasY) {
    this.location = this.getLocation(shapeObject, arguments, canvasX, canvasY);
    this.area = this.getObjectArea(shapeObject.name, arguments);
    this.coordLoc = this.canvasLocator(shapeObject, arguments, canvasX, canvasY);
  }

  this.getAttributes = function() {
    return({
      type: this.type,
      location: this.location,
      coordinates: this.coordinates,
      area: this.area
    })
  };

  /* return area of the shape */
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


}
