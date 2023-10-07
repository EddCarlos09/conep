// Config object to be passed to Msal on creation
export const msalConfig = {
    auth: {
        clientId: "11111111-1111-1111-111111111111",
        authority: "https://login.microsoftonline.com/common",
        knownAuthorities: [],
        redirectUri: "https://localhost:3000",
        postLogoutRedirectUri: "https://localhost:3000/logout",
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    },
};

// export const msalConfig = {
//     auth: {
//         clientId: "0a61c279-646b-4055-a5f1-1c3da7f70f18",
// 		postLogoutRedirectUri: "https://api.observatoriolegislativoconep.com/logout"
//     },
//     cache: {
//         cachelocation: "sessionstorage",
//         storeauthstateincookie: true
//     },
// };
// // Add here scopes for id token to be used at MS Identity Platform endpoints.
// export const loginRequest = {
//     scopes: ["User.Read"]
// };

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
