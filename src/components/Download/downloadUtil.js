/**
 * Convert bytes to better representation.
 * 
 * @param {Number} bytes 
 */
exports.bytesToSize = (bytes) => {
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0 || typeof(bytes) !== 'number') return '0 B';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return (bytes / Math.pow(1024, i)).toFixed(2) + sizes[i];
}