module.exports = {
  isWebsite() {
    var currentLocation = window.location.pathname;
    return currentLocation == "/";
  },
  dashboardProd: "https://redpaydashboard.azurewebsites.net",

  websiteDev: "https://rswebsiteapi.azurewebsites.net",
  websiteStage: "https://rswebsiteapi.azurewebsites.net",
  websiteProd: "https://rswebsiteapi.azurewebsites.net",

  payFlowDemo: "https://payflow-backend-demo.azurewebsites.net",
  payFlowStable: "https://stablepayflowbackend.azurewebsites.net",

  redPayDev: "https://redpaystable.azurewebsites.net",
  redPayDemo: "https://redpaydemo.azurewebsites.net",
  redPayStage: "https://redpaystable.azurewebsites.net",
  redPayProd: "https://redpaystable.azurewebsites.net",
};
