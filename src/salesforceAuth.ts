// Salesforce OAuth2 configuration
export const SALESFORCE_OAUTH2 = {
  clientId: process.env.SF_CLIENT_ID || '',
  redirectUri: process.env.REDIRECT_URI || (window.location.origin + '/oauth/callback'),
  authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
  responseType: 'code',
  scope: process.env.OAUTH_SCOPES || 'openid profile email',
};

// PKCE helper functions
export async function generateCodeVerifier() {
  const array = new Uint32Array(56/2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  // Convert ArrayBuffer to base64url string
  let binary = '';
  const bytes = new Uint8Array(digest);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
