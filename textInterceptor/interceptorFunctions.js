function textInterceptor() { // eslint-disable-line
  var self = this;
  baseInterceptor.call(self);
}
textInterceptor.prototype = Object.create(baseInterceptor.prototype);

textInterceptor.prototype.clearVariables = function(object) {
  object.objectTypeCount = {};
  object.objectCount = 0;
  this.isCleared = true;
  return object;
}

textInterceptor.prototype.populateObject = function(x, arguments, object, table, isDraw) {
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

  var entityClass = BaseEntity.entityFor(x.name);

  if (entityClass && !entityClass.isParameter) {
    objectArray[objectCount] = new entityClass(this, x, arguments, this.canvasDetails.width, this.canvasDetails.height);

    if (objectTypeCount[x.name]) {
      objectTypeCount[x.name]++;
    } else {
      objectTypeCount[x.name] = 1;
    }
    objectCount++;
  } else if (entityClass && entityClass.isParameter) {
    new entityClass(this, x, arguments, this.canvasDetails.width, this.canvasDetails.height);
  }
  return ({
    objectCount: objectCount,
    objectArray: objectArray,
    objectTypeCount: objectTypeCount
  });
}

textInterceptor.prototype.populateTable = function(table, objectArray) {
  if (this.totalCount < 100) {
    if (this.prevTotalCount > this.totalCount) {
      for (var j = 0; j < this.totalCount; j++) {
        var row = table.children[j];
        var tempCol = row.children.length;
        var properties = Object.keys(objectArray[j].getAttributes());

        if (tempCol < properties.length) { // ie - there are more cols now
          for (var i = 0; i < tempCol; i++) {
            if (properties[i].localeCompare('type')) {
              row.children[i].innerHTML = properties[i] + ' = ' + objectArray[j][properties[i]];
            } else {
              row.children[i].innerHTML = objectArray[j][properties[i]];
            }
          }
          for (var i = tempCol; i < properties.length; i++) {
            var col = document.createElement('td');
            if (properties[i].localeCompare('type')) {
              col.children[i].innerHTML = properties[i] + ' = ' + objectArray[j][properties[i]];
            } else {
              col.children[i].innerHTML = objectArray[j][properties[i]];
            }

            row.appendChild(col);
          }
        } else { // ie - there are fewer cols now
          for (var i = 0; i < properties.length; i++) {
            if (properties[i].localeCompare('type')) {
              row.children[i].innerHTML = properties[i] + ' = ' + objectArray[j][properties[i]];
            } else {
              row.children[i].innerHTML = objectArray[j][properties[i]];
            }
          }
          for (var i = properties.length; i < tempCol; i++) {
            var tempCol = row.children[i];
            row.removeChild(tempCol);
          }
        }
      }
      for (var j = this.totalCount; j < this.prevTotalCount; j++) {
        var tempRow = table.children[j];
        table.removeChild(tempRow);
      }
    } else if (this.prevTotalCount <= this.totalCount) {
      for (var j = 0; j < this.prevTotalCount; j++) {
        var row = table.children[j];
        var tempCol = row.children.length;
        var properties = Object.keys(objectArray[j].getAttributes());

        if (tempCol < properties.length) { // ie - there are more cols now
          for (var i = 0; i <= tempCol; i++) {
            if (properties[i].localeCompare('type')) {
              row.children[i].innerHTML = properties[i] + ' = ' + objectArray[j][properties[i]];
            } else {
              row.children[i].innerHTML = objectArray[j][properties[i]];
            }
          }
          for (var i = tempCol; i < properties.length; i++) {
            var col = document.createElement('td');

            if (properties[i].localeCompare('type')) {
              col.innerHTML = properties[i] + ' = ' + objectArray[j][properties[i]];
            } else {
              col.innerHTML = objectArray[j][properties[i]];
            }
            row.appendChild(col);
          }
        } else { // ie - there are fewer cols now
          for (var i = 0; i < properties.length; i++) {
            if (properties[i].localeCompare('type')) {
              row.children[i].innerHTML = properties[i] + ' = ' + objectArray[j][properties[i]];
            } else {
              row.children[i].innerHTML = objectArray[j][properties[i]];
            }
          }
          for (var i = properties.length; i < tempCol; i++) {
            var tempCol = row.children[i];
            row.removeChild(tempCol);
          }
        }
      }
      for (var j = this.prevTotalCount; j < this.totalCount; j++) {
        var row = document.createElement('tr');
        row.id = 'object' + j;
        var properties = Object.keys(objectArray[j].getAttributes());
        for (var i = 0; i < properties.length; i++) {
          var col = document.createElement('td');
          if (properties[i].localeCompare('type')) {
            col.innerHTML = properties[i] + ' = ' + objectArray[j][properties[i]];
          } else {
            col.innerHTML = objectArray[j][properties[i]];
          }
          row.appendChild(col);
        }
        table.appendChild(row);
      }
    }
  }
}

textInterceptor.prototype.getSummary = function(object1, object2, element) {
  this.prevTotalCount = this.totalCount;
  this.totalCount = object1.objectCount + object2.objectCount;
  element.innerHTML = '';
  element.innerHTML += this.bgColor + ' coloured canvas is ' + this.canvasDetails.width + ' by ' +
    this.canvasDetails.height + ' of area ' + this.canvasDetails.width * this.canvasDetails.height;
  if (this.totalCount > 1) {
    element.innerHTML += ' Contains ' + this.totalCount + ' objects - ';
  } else {
    element.innerHTML += ' Contains ' + this.totalCount + ' object - ';
  }

  if (object2.objectCount > 0 || object1.objectCount > 0) {
    totObjectTypeCount = mergeObjRecursive(object1.objectTypeCount, object2.objectTypeCount);
    var keys = Object.keys(totObjectTypeCount);
    for (var i = 0; i < keys.length; i++) {
      element.innerHTML += totObjectTypeCount[keys[i]] + ' ' + keys[i] + ' ';
    }

    var objectList = document.createElement('ul');

    if (this.totalCount < 100) {

      object1.objectArray.forEach(function(objArrayItem){
        var objectListItem = document.createElement('li');
        objectList.appendChild(objectListItem);
        var objLink = document.createElement('a');
        objLink.href = '#object' + i;
        objLink.innerHTML = objArrayItem['type'];
        objectListItem.appendChild(objLink);
        objectListItem.innerHTML += '; area = ' + objArrayItem['area'] +
          '; location = ' + objArrayItem['location'];
      });
      object2.objectArray.forEach(function(objArrayItem){
        var objectListItem = document.createElement('li');
        objectList.appendChild(objectListItem);
        var objLink = document.createElement('a');
        objLink.href = '#object' + (i + object1.objectArray.length);
        objLink.innerHTML = objArrayItem['type'];
        objectListItem.appendChild(objLink);
        objectListItem.innerHTML += '; area = ' + objArrayItem['area'] +
          '; location = ' + objArrayItem['location'];
      });
      element.appendChild(objectList);
    }
  }
}

var Interceptor = new textInterceptor();
