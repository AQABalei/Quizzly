module.exports = {
  isRoot() {
    var currentLocation = window.location.pathname;
    return currentLocation == "/";
  },
  //quizzlyProd: "https://quizzly-backend-prod.herokuapp.com",
  quizzlyProd: "http://18.220.74.243:1337",
  localhost: "http://localhost:1337",
};
