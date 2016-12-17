var shadowDOMElement; // eslint-disable-line
function InterceptorFn() {
  var self = this;
  baseInterceptor.call(self);
  this.noRows = 10,
  this.noCols = 10,
  this.coordLoc = {},

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

    if (!x.name.localeCompare('fill')) {
      this.currentColor = this.getColorName(arguments)['color'] + this.getColorName(arguments)['rgb'];
    } else if (!x.name.localeCompare('background')) {
      this.bgColor = this.getColorName(arguments)['color'] + this.getColorName(arguments)['rgb'];
    } 

    var entityClass = BaseEntity.entityFor(x.name);

    if (entityClass) {
      objectArray[objectCount] = new entityClass(this,x,arguments,this.canvasDetails.width,this.canvasDetails.height);

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
          var objKeys = Object.keys(object1.objectArray[i].getAttributes());
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
          var objKeys = Object.keys(object2.objectArray[i].getAttributes());
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
