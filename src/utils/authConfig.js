export const msalConfig = {
  auth: {
    clientId: 'c6d8daf9-f254-4fd6-824d-11105e3f48e9',
    authority: `https://login.microsoftonline.com/75504aa9-e9ba-434e-9986-779973a88e37`,
    redirectUri: window.location.origin 
  },
  cache: {
    cacheLocation: "sessionStorage", 
    storeAuthStateInCookie: false, 
  }
};