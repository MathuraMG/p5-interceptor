function TextEntity(textObject,arguments, canvasX, canvasY) {
  var self = this;
  BaseEntity.call(self,shapeObject,arguments, canvasX, canvasY);

  this.populate = function(shapeObject, arguments, canvasX, canvasY) {
    this.location = this.getLocation(shapeObject, arguments, canvasX, canvasY);
    this.coordLoc = this.canvasLocator(shapeObject, arguments, canvasX, canvasY);
  }



}
