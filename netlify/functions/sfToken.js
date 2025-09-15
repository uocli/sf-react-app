const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { code, code_verifier, redirect_uri, client_id } = JSON.parse(event.body);

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id,
    redirect_uri,
    code_verifier,
  });

  const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  const data = await response.json();

  return {
    statusCode: response.ok ? 200 : 400,
    body: JSON.stringify(data),
  };
};