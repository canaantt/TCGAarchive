/* 
    This is the code to generate ajv_v2.json, the stage II datasource schema validation
    requires: ajv.json generated by mongooseTest.js
    Purposes
            - re-organize the error messages 
            - calculate the passed percentage at collection level
*/
var jsonfile = require("jsonfile");
var ajvMsg = [];

jsonfile.readFile("ajv_1012.json", function(err, obj) {
  ajvMsg = obj;
});

Array.prototype.unique = function() {
        var arr = [];
        for(var i = 0; i < this.length; i++) {
            if(arr.indexOf(this[i]) === -1) {
                arr.push(this[i]);
            }
        }
        return arr; 
    };

Array.prototype.table = function(uniqueArray) {
    var elem = {};
    uniqueArray.forEach(function(u){
        elem[u] = 0;
    });
    for(var i = 0; i < this.length; i++){
        if(uniqueArray.indexOf(this[i]['errorType']) > -1){
            elem[this[i]['errorType']]++;
        }
    }
    return elem;

};

Object.prototype.nestedUnique = function(){
    var ar = [];
    this['errors'].forEach(function(a){
        ar.push(a['errorType']);
    });
    return ar.unique();
};

console.log(ajvMsg.length);

ajvMsg_v2 = ajvMsg.map(function(a){
    var elem = {};
    elem.collection = a.collection;
    elem.type = a.type;
    elem.disease = a.disease;
    elem.passedCounts = a.passedCounts;
    elem.totalCounts = a.totalCounts;
    elem.passedRate = a.passedCounts/a.totalCounts;
    elem.errorMessage = a.errors.table(a.nestedUnique());
    return elem;
});

jsonfile.writeFile('ajv_tcga_v2.json', ajvMsg_v2, {spaces:4}, function(err){console.log(err);});
