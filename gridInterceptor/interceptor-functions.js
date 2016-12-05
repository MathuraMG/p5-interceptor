var shadowDOMElement; // eslint-disable-line
function InterceptorFn() {
  var self = this;
  baseInterceptor.call(self);
  this.noRows = 10,
  this.noCols = 10,
  this.coordLoc = {},

  /* return which part of the canvas an object os present */
  this.canvasLocator = function(x, arguments, canvasX, canvasY) {
    var xCoord, yCoord;
    var locX, locY;
    for (var i = 0; i < arguments.length; i++) {
      a = arguments[i];
      if (x.params[i].description.indexOf('x-coordinate') > -1) {
        xCoord = a;
      } else if (x.params[i].description.indexOf('y-coordinate') > -1) {
        yCoord = a;
      }
    }

    locX = Math.floor((xCoord / canvasX) * this.noRows);
    locY = Math.floor((yCoord / canvasY) * this.noCols);
    if (locX == this.noRows) {
      locX = locX - 1;
    }
    if (locY == this.noCols) {
      locY = locY - 1;
    }
    return ({
      locX: locX,
      locY: locY
    });
  },

  this.clearVariables = function(object) {
    object.objectTypeCount = {};
    object.objectCount = 0;
    this.isCleared = true;
    return object;
  },

  this.createShadowDOMElement = function(document) {
    var contentTable = document.getElementById('textOutput-content-table');
    for (var i = 0; i < this.noRows; i++) {
      var row = document.createElement('tr');

      for (var j = 0; j < this.noCols; j++) {
        var col = document.createElement('td');
        col.className = 'textOutput-cell-content';
        col.innerHTML = 'test';
        row.appendChild(col);
      }
      contentTable.appendChild(row);
    }
    shadowDOMElement = document.getElementById('textOutput-content');
  },
  this.populateObject = function(x, arguments, object, table, isDraw) {
    objectCount = object.objectCount;
    objectArray = object.objectArray;
    objectTypeCount = object.objectTypeCount;
    if (!isDraw) {
      // check for special function in setup -> createCanvas
      if (!x.name.localeCompare('createCanvas')) {
        this.canvasDetails.width = arguments[0];
        this.canvasDetails.height = arguments[1];
      }
    }


    if (!x.module.localeCompare('Shape')) {
      objectArray[objectCount] = new shapeEntity(x);
                  // // for 2D functions and text function
                  // this.objectArea = this.getObjectArea(x.name, arguments);
                  // var canvasLocation = this.canvasAreaLocation(x, arguments, width, height);
                  // this.coordLoc = this.canvasLocator(x, arguments, width, height);
                  // // in case of text, the description should be what is in the content
                  // if (x.name.localeCompare('text')) {
                  //   this.objectDescription = x.name;
                  // } else {
                  //   this.objectDescription = String(arguments[0]).substring(0, 20);
                  // }
                  // objectArray[objectCount] = {
                  //   'type': this.currentColor + ' - ' + this.objectDescription,
                  //   'location': canvasLocation, // top left vs top right etc
                  //   'coordLoc': this.coordLoc, // 3,3 vs 5,3 etc
                  //   'area': this.objectArea,
                  //   'co-ordinates': this.coordinates // coordinates of where the objects are drawn
                  // };
                  // this.coordinates = [];
                  //
                  // // add the object(shape/text) parameters in objectArray
                  // for (var i = 0; i < arguments.length; i++) {
                  //   if (!(typeof(arguments[i])).localeCompare('number')) {
                  //     arguments[i] = round(arguments[i]);
                  //   }
                  //   if (x.params[i].description.indexOf('x-coordinate') > -1) {
                  //     objectArray[objectCount]['co-ordinates'].push(arguments[i] + 'x');
                  //   } else if (x.params[i].description.indexOf('y-coordinate') > -1) {
                  //     objectArray[objectCount]['co-ordinates'].push(arguments[i] + 'y');
                  //   } else {
                  //     objectArray[objectCount][x.params[i].description] = arguments[i];
                  //   }
                  // }
        if (objectTypeCount[x.name]) {
          objectTypeCount[x.name]++;
        } else {
          objectTypeCount[x.name] = 1;
        }
        objectCount++;
    }
    return ({
      objectCount: objectCount,
      objectArray: objectArray,
      objectTypeCount: objectTypeCount
    });
  },

  this.populateTable = function(objectArray, documentPassed) {
    if (this.totalCount < 100) {
      for (var i = 0; i < objectArray.length; i++) {
        var cellLoc = objectArray[i].coordLoc.locY * this.noRows + objectArray[i].coordLoc.locX;
        // add link in table
        var cellLink = documentPassed.createElement('a');
        cellLink.innerHTML += objectArray[i].type;
        var objectId = '#object' + i;
        cellLink.setAttribute('href', objectId);
        documentPassed.getElementsByClassName('textOutput-cell-content')[cellLoc].appendChild(cellLink);
      }
    }
  },

  /* helper function to populate object Details */
  this.populateObjectDetails = function(object1, object2, elementSummary, elementDetail) {
    this.prevTotalCount = this.totalCount;
    this.totalCount = object1.objectCount + object2.objectCount;
    elementSummary.innerHTML = '';
    elementDetail.innerHTML = '';
    elementSummary.innerHTML += this.bgColor + ' canvas is ' + this.canvasDetails.width + ' by '
    + this.canvasDetails.height + ' of area ' + this.canvasDetails.width * this.canvasDetails.height;
    if (this.totalCount > 1) {
      elementSummary.innerHTML += ' Contains ' + this.totalCount + ' objects - ';
    } else {
      elementSummary.innerHTML += ' Contains ' + this.totalCount + ' object - ';
    }

    if (object2.objectCount > 0 || object1.objectCount > 0) {
      totObjectTypeCount = mergeObjRecursive(object1.objectTypeCount, object2.objectTypeCount);
      var keys = Object.keys(totObjectTypeCount);
      for (var i = 0; i < keys.length; i++) {
        elementSummary.innerHTML += totObjectTypeCount[keys[i]] + ' ' + keys[i] + ' ';
      }

      var objectList = document.createElement('ul');

      if (this.totalCount < 100) {
        for (var i = 0; i < object1.objectArray.length; i++) {
          var objectListItem = document.createElement('li');
          objectListItem.id = 'object' + i;
          objectList.appendChild(objectListItem);
          var objKeys = Object.keys(object1.objectArray[i]);
          for (var j = 0; j < objKeys.length; j++) {
            if (objKeys[j].localeCompare('coordLoc')) {
              if (objKeys[j].localeCompare('type')) {
                objectListItem.innerHTML += objKeys[j] + ' = ' + object1.objectArray[i][objKeys[j]] + ' ';
              } else {
                objectListItem.innerHTML += object1.objectArray[i][objKeys[j]] + ' ';
              }
            }
          }
        }
        for (var i = 0; i < object2.objectArray.length; i++) {
          var objectListItem = document.createElement('li');
          objectListItem.id = 'object' + (object1.objectArray.length + i);
          objectList.appendChild(objectListItem);
          var objKeys = Object.keys(object2.objectArray[i]);
          for (var j = 0; j < objKeys.length; j++) {
            if (objKeys[j].localeCompare('coordLoc')) {
              if (objKeys[j].localeCompare('type')) {
                objectListItem.innerHTML += objKeys[j] + ' = ' + object2.objectArray[i][objKeys[j]] + ' ';
              } else {
                objectListItem.innerHTML += object2.objectArray[i][objKeys[j]] + ' ';
              }
            }
          }
        }
        elementDetail.appendChild(objectList);
      }
    }
  }
};

var Interceptor = new InterceptorFn();
