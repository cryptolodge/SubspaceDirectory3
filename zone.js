/**
 * New node file
 */

// Constructor
var Zone = function() {
  
}
// properties and methods
Zone.prototype = {
  ip: "default_value",
  method: function(argument) {
    this.value2 = argument + 100;
  }
};
// node.js module export
module.exports = Zone;