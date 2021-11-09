exports.clean = (obj = {}) => {
  for (var propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === "" ||
      obj[propName] === {}
    ) {
      delete obj[propName];
    }
  }
  return obj;
};

exports.objectFilter = (object) => {
  if (object instanceof Object) {
    Object.keys(object).forEach(
      (key) =>
        (object[key] == null || object[key] == undefined || object[key] == "") && delete object[key]
    );

    return object;
  }

  throw "Supports only Object as a argument";
};
