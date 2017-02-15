function TextEntity(Interceptor,shapeObject,arguments, canvasX, canvasY) {
  var self = this;
  BaseEntity.call(self,shapeObject,arguments, canvasX, canvasY);
  this.type = String(arguments[0]).substring(0, 20) + '(' + Interceptor.currentColor + ')';

  this.populate = function(shapeObject, arguments, canvasX, canvasY) {
    this.location = this.getLocation(shapeObject, arguments, canvasX, canvasY);
    this.coordLoc = this.canvasLocator(shapeObject, arguments, canvasX, canvasY);
  };

  this.getAttributes = function() {
    return({
      type: this.type,
      location: this.location,
      coordinates: this.coordinates,
    })
  };

  this.populate(shapeObject,arguments, canvasX, canvasY);
}

TextEntity.handledNames = [
  'text'
]

TextEntity.handles = function(name) {
  return (this.handledNames.indexOf(name) >= 0);
}

TextEntity.isParameter = false;

Registry.register(TextEntity);
