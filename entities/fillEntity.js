function FillEntity(Interceptor,shapeObject,arguments, canvasX, canvasY) {
  var self = this;
  // BaseEntity.call(self,shapeObject,arguments, canvasX, canvasY);
  // this.type = String(arguments[0]).substring(0, 20);

  this.populate = function(Interceptor) {
    console.log(Interceptor)
  }

  // this.getAttributes = function() {
  //   return({
  //     type: this.type,
  //     location: this.location,
  //     coordinates: this.coordinates,
  //   })
  // };

  this.populate(Interceptor);
}
FillEntity.handledNames = [
  'fill'
]

FillEntity.handles = function(name) {
  return (this.handledNames.indexOf(name) >= 0);
}

BaseEntity.register(FillEntity);
