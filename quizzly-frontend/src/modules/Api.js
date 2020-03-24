var Url = require('./Url.js');

// Let ajax use cookies
$.ajaxSetup({
  xhrFields: {
    withCredentials: true
  },
  crossDomain: true
});

class Route {
  constructor(baseUrl) {
    this.baseUrl = `${baseUrl}/`;
  }
  post(url, data) {
    if(arguments.length == 1) {
      return $.post(this.baseUrl + url);
    }

    return $.post(this.baseUrl + url, data);
  }
  create(model, data) {
    return $.post(this.baseUrl + model + '/create', data);
  }
  findOne(model, id) {
    var findUrl = '/find/';
    return $.post(this.baseUrl + model + findUrl + id);
  }
  find(model, data) {
    var findUrl = '/find/';
    if(arguments.length == 1) {
      return $.post(this.baseUrl + model + findUrl);
    }

    return $.post(this.baseUrl + model + findUrl, data);
  }
  update(model, id, data) {
    if(arguments.length == 2){
      return $.post(this.baseUrl + model + '/update', data);
    }
    return $.post(this.baseUrl + model + '/update/' + id, data);
  }
  updateId(model, id,data) {
    return $.post(this.baseUrl + model + '/update/' + id, data);
  }
  addTo(model, id, association, fk) {
    // /:model/:id/:association/:fk
    return $.post(`${this.baseUrl}${model}/${id}/${association}/${fk}`);
  }
  delete(model, id, data) {
    if(arguments.length == 2) {
      return $.post(this.baseUrl + model + '/delete/' + id);
    }

    return $.post(this.baseUrl + model + '/delete/' + id, data);
  }
  deleteFrom(model, id, association, fk) {
    // /:model/:id/:association/:fk
    return $.ajax({
      url: `${this.baseUrl}${model}/${id}/${association}/${fk}`,
      method: 'DELETE',
      dataType: 'json',
      crossDomain: true
    });
  }
}

function chooseUrl(routeType){
  //XXX: Find a way to remove .com
  var domain = window.location.hostname.match(/(http(s)?:\/\/)?(www\.)?(.+)(\.com)?/);
  switch(domain[4]){
    case "localhost":
      return Url[`${routeType}Stable`];
    case `quizzly-${routeType.toLowerCase()}-dev.herokuapp.com`:
      return Url[`${routeType}Stable`];
    case `quizzly-${routeType.toLowerCase()}-prod.herokuapp.com`:
      return Url[`${routeType}Stable`];
    case `quizzly-${routeType.toLowerCase()}-demo.herokuapp.com`:
      return Url[`${routeType}Demo`];
    default:
      return Url[`${routeType}Stable`];
  }
}

var Api = module.exports = {
  server: new Route(process.env.NODE_ENV == 'development' ? process.env.DEV_ROOT_URL : process.env.PROD_ROOT_URL),
  db: new Route(process.env.NODE_ENV == 'development' ? process.env.DEV_ROOT_URL : process.env.PROD_ROOT_URL),
  otherDb: new Route(chooseUrl("redPay")),
  baseUrl:  process.env.NODE_ENV == 'development' ? process.env.DEV_ROOT_URL : process.env.PROD_ROOT_URL,
}
