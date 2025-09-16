import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import {
  SALESFORCE_OAUTH2,
  generateCodeVerifier,
  generateCodeChallenge,
} from "./salesforceAuth";

function App() {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("sf_access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const codeVerifier = await generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    sessionStorage.setItem("sf_code_verifier", codeVerifier);
    const params = new URLSearchParams({
      response_type: SALESFORCE_OAUTH2.responseType,
      client_id: SALESFORCE_OAUTH2.clientId,
      redirect_uri: SALESFORCE_OAUTH2.redirectUri,
      scope: SALESFORCE_OAUTH2.scope,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });
    window.location.href = `${SALESFORCE_OAUTH2.authUrl}?${params.toString()}`;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {isLoggedIn ? (
          <div style={{ margin: "1em", fontSize: "1.2em", color: "#0f0" }}>
            Logged in with Salesforce!
          </div>
        ) : (
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ margin: "1em", padding: "1em 2em", fontSize: "1em" }}
          >
            {loading ? "Redirecting..." : "Login with Salesforce"}
          </button>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
