import React, { useEffect } from "react";
import { SALESFORCE_OAUTH2 } from "../salesforceAuth";

const OAuthCallback: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (!code) {
      // Handle error or missing code
      window.location.replace("/");
      return;
    }
    // Exchange code for token (PKCE)
    const codeVerifier = sessionStorage.getItem("sf_code_verifier");
    if (!codeVerifier) {
      window.location.replace("/");
      return;
    }
    const data = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: SALESFORCE_OAUTH2.clientId,
      redirect_uri: SALESFORCE_OAUTH2.redirectUri,
      code_verifier: codeVerifier,
    });
    // fetch("https://login.salesforce.com/services/oauth2/token", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   body: data.toString(),
    // })
    //   .then((res) => res.json())
    //   .then((result) => {
    //     if (result.access_token) {
    //       // Store token and redirect to app
    //       localStorage.setItem("sf_access_token", result.access_token);
    //       window.location.replace("/");
    //     } else {
    //       // Handle error
    //       window.location.replace("/");
    //     }
    //   });
    fetch("/.netlify/functions/sfToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
        redirect_uri: SALESFORCE_OAUTH2.redirectUri,
        client_id: SALESFORCE_OAUTH2.clientId,
    }),
    })
    .then((res) => res.json())
    .then((result) => {
        if (result.access_token) {
        localStorage.setItem("sf_access_token", result.access_token);
        window.location.replace("/");
        } else {
        // Handle error
        window.location.replace("/");
        }
    });
  }, []);
  return <div>Logging in with Salesforce...</div>;
};

export default OAuthCallback;
