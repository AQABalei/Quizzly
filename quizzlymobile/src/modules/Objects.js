var Objects = module.exports = {
  merge: function(obj, src) {
    if(obj == undefined) {
      return src;
    }

    if(src == undefined) {
      return obj;
    }

    for (var key in src) {
      if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
  },
}
