

funcNames = allData['classitems'].map(function(x) {
  if (x['overloads']) {
    tempParam = x['overloads'][0]['params'];
  } else {
    tempParam = x['params'];
  }
  return {
    name: x['name'],
    params: tempParam,
    class: x['class'],
    module: x['module'],
    submodule: x['submodule'],
  };
});

funcNames = funcNames.filter(function(x) {
  var className = x['class'];
  return (x['name'] && x['params'] && (className === 'p5'));
});

funcNames.forEach(function(x) {
  var document = parent.document;
  var originalFunc = p5.prototype[x.name];
  var byID = function(id) {
    var element = document.getElementById(id);
    return element;
  };
  var details = byID('textOutput-content-details');
  var summary = byID('textOutput-content-summary');
  var table = byID('textOutput-content-table');

  p5.prototype[x.name] = function() {
    orgArg = arguments;

    if (frameCount == 0) { // for setup
      table.innerHTML = '';
      details.innerHTML = '';
      summary.innerHTML = '';
      Interceptor.createShadowDOMElement(document);
      Interceptor.setupObject =
      Interceptor.populateObject(x, arguments, Interceptor.setupObject, details, false);
      Interceptor.populateObjectDetails(Interceptor.setupObject, Interceptor.drawObject, summary, details);
      Interceptor.populateTable(details, Interceptor.setupObject);
    } else if (frameCount % 50 == 0) {
      Interceptor.drawObject =
      Interceptor.populateObject(x, arguments, Interceptor.drawObject, details, true);
      Interceptor.isCleared = false;
    } else if (frameCount % 50 == 1) { // reset some of the variables
      if (!Interceptor.isCleared) {
        var cells = document.getElementsByClassName('textOutput-cell-content');
        for (i = 0; i < cells.length; i++) {
          cells[i].innerHTML = '';
        }
        Interceptor.populateObjectDetails(Interceptor.setupObject, Interceptor.drawObject, summary, details);
        Interceptor.populateTable(Interceptor.setupObject.objectArray.concat(Interceptor.drawObject.objectArray),
        document);
      }
      Interceptor.drawObject = Interceptor.clearVariables(Interceptor.drawObject);
    }
    return originalFunc.apply(this, arguments);
  };
});
