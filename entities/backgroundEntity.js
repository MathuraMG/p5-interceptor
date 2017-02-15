function BackgroundEntity(Interceptor,object,arguments, canvasX, canvasY) {
  var self = this;
  var passedArguments = arguments;
  this.populate = function(Interceptor) {
    Interceptor.bgColor = Interceptor.getColorName(passedArguments)['color'] + Interceptor.getColorName(passedArguments)['rgb'];
  }

  this.populate(Interceptor);
}
BackgroundEntity.handledNames = [
  'background'
]

BackgroundEntity.handles = function(name) {
  return (this.handledNames.indexOf(name) >= 0);
}

BackgroundEntity.isParameter = true;

Registry.register(BackgroundEntity);
