/*
  Usage:
  var Api = require("../Modules/Api.js");
  Api.server.find('user');
  Api.server.post('someurl', data); // data is optional
  Api.server.post('login', data);
  Api.server.post('logout');
  Api.server.create('user', {email: 'conner@conner.com', password: 'test'});
  Api.server.update('user', {firstName: 'Newname'}, fj48f43lvn943gl); // fj48f43lvn943gl == some id
*/

var Url = require("./Url.js");
// var jwt = persistentStorage['jwt'];

class Route {
  setJwt(jwt) {
    this.jwt = jwt;

    //persistentlly store the jwt list and values.
    // persistentStorage.set('jwt', jwt);
  }
  constructor(baseUrl) {
    this.baseUrl = `${baseUrl}/`;
  }
  fetchPost(url, data) {
    var options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'jwt': this.jwt || ''
      }
    };
    if(arguments.length == 1) {
      return fetch(url, options).then(res => res.json());
    }
    options.body = JSON.stringify(data);
    return fetch(url, options).then(res => res.json());
  }
  fetchDelete(url, data) {
    var options = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    };
    if(arguments.length == 1) {
      return fetch(url, options).then(res => res.json());
    }
    options.body = JSON.stringify(data);
    return fetch(url, options).then(res => res.json());
  }
  post(url, data) {
    if(arguments.length == 1) {
      return this.fetchPost(this.baseUrl + url);
    }

    return this.fetchPost(this.baseUrl + url, data);
  }
  create(model, data) {
    return this.fetchPost(this.baseUrl + model + '/create', data);
  }
  findOne(model, id) {
    return this.fetchPost(this.baseUrl + model + '/find/' + id);
  }
  find(model, data) {
    var findUrl = '/find/';
    if(arguments.length == 1) {
      return this.fetchPost(this.baseUrl + model + findUrl);
    }

    return this.fetchPost(this.baseUrl + model + findUrl, data);
  }
  update(model, data, id) {
    if(arguments.length == 2){
      return this.fetchPost(this.baseUrl + model + '/update', data);
    }
    return this.fetchPost(this.baseUrl + model + '/update/' + id, data);
  }
  updateId(model, id,data) {
    return this.fetchPost(this.baseUrl + model + '/update/' + id, data);
  }
  addTo(model, id, association, fk) {
    // /:model/:id/:association/:fk
    return this.fetchPost(`${this.baseUrl}${model}/${id}/${association}/${fk}`);
  }
  delete(model, id, data) {
    if(arguments.length == 2) {
      return this.fetchPost(this.baseUrl + model + '/delete/' + id);
    }

    return this.fetchPost(this.baseUrl + model + '/delete/' + id, data);
  }
  deleteFrom(model, id, association, fk) {
    // /:model/:id/:association/:fk
    return this.fetchDelete(`${this.baseUrl}${model}/${id}/${association}/${fk}`);
  }

  //CODE THE NEEDS CHANGE
   logIn(email,pwd) {
    var findUrl = '/auth/login';
    //create a json object and store the email and pwd in there.
    var LoginInfo

    Api.server.post('login',LoginInfo)
    .then((loginResponse)=>{
      AsyncStorage.setItem('token',loginResponse.token);
      dispatch({
        type:actionTypes.LOGIN_USER
      })
      dispatch(registerActions.updateUserInfo(loginResponse.user()))
      //do something here
    })

    return this.fetchPost(this.baseUrl + model + findUrl, data);
  }

  LogOut(){
    AsyncStorage.removeItem('token')
    .then(()=>{
      //naviaget to the entrance page
    })
  }
}

function chooseUrl(routeType) {
  //NOTE: Find a way to remove .com
  var domain = window.location.hostname.match(/(http(s)?:\/\/)?(www\.)?(.+)(\.com)?/);
  switch(domain[4]){
    case "localhost":
      return Url.localhost;
    case `quizzly-${routeType.toLowerCase()}-dev.herokuapp.com`:
      return Url[`${routeType}Prod`];
    case `quizzly-${routeType.toLowerCase()}-prod.herokuapp.com`:
      return Url[`${routeType}Demo`];
    case `quizzly-${routeType.toLowerCase()}-demo.herokuapp.com`:
      return Url[`${routeType}Demo`];
    default:
      return Url[`${routeType}Prod`];
  }
}

var Api = module.exports = {
  server: new Route(Url.quizzlyProd),
  db: new Route(Url.quizzlyProd),
  // baseUrl: window.location.port == '8081' ? Url.localhost : Url.cornerProd,
}
