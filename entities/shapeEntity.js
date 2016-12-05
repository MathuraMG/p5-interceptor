function shapeEntity() {
  var self = this;
  baseInterceptor.call(self);
  this.type = 'Shape',
  this.location = 'topleft', // top left vs top right etc
  this.coordLoc = '', // 3,3 vs 5,3 etc
  this.area = 540,
  this.coordinates = [] // coordinates of where the objects are drawn
}
