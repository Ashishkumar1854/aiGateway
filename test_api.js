const http = require('http');

async function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(resBody) });
        } catch (e) {
          resolve({ status: res.statusCode, data: resBody });
        }
      });
    });

    req.on('error', e => reject(e));
    if (body) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- Auth Tests ---');
  let res = await request('POST', '/api/v1/auth/signup', { name: "Test Admin", email: "newadmin" + Date.now() + "@test.com", password: "test1234", role: "ADMIN" });
  console.log('Signup:', res.status, res.data.success ? 'Success' : 'Fail');

  res = await request('POST', '/api/v1/auth/login', { email: "admin@aigateway.com", password: "admin123" });
  console.log('Login:', res.status, res.data.success ? 'Success' : 'Fail');
  const token = res.data.data?.accessToken;
  const refreshToken = res.data.data?.refreshToken;
  
  res = await request('GET', '/api/v1/auth/me', null, token);
  console.log('Get Me:', res.status, res.data.success ? 'Success' : 'Fail');

  res = await request('POST', '/api/v1/auth/refresh', { refreshToken });
  console.log('Refresh:', res.status, res.data.success ? 'Success' : 'Fail');
  
  console.log('\\n--- Protected Route Tests ---');
  res = await request('GET', '/api/v1/users', null, token);
  console.log('Get Users:', res.status, res.data.success ? 'Success' : 'Fail');

  res = await request('GET', '/api/v1/clients', null, token);
  console.log('Get Clients:', res.status, res.data.success ? 'Success' : 'Fail');

  res = await request('GET', '/api/v1/crm/leads', null, token);
  console.log('Get Leads:', res.status, res.data.success ? 'Success' : 'Fail');

  res = await request('GET', '/api/v1/crm/pipeline', null, token);
  console.log('Get Pipeline:', res.status, res.data.success ? 'Success' : 'Fail');

  res = await request('GET', '/api/v1/agents/stats', null, token);
  console.log('Get Agent Stats:', res.status, res.data.success ? 'Success' : 'Fail');

  res = await request('GET', '/api/v1/services', null, token);
  console.log('Get Services:', res.status, res.data.success ? 'Success' : 'Fail');

  res = await request('GET', '/api/v1/agents/tasks?status=AWAITING_APPROVAL', null, token);
  console.log('Get Agent Tasks:', res.status, res.data.success ? 'Success' : 'Fail');

  console.log('\\n--- RBAC & 401 Tests ---');
  // Login as client
  let clientLogin = await request('POST', '/api/v1/auth/login', { email: "client@testcompany.com", password: "client123" });
  const clientToken = clientLogin.data.data?.accessToken;

  res = await request('GET', '/api/v1/users', null, clientToken);
  console.log('RBAC Test (Client fetching users):', res.status, res.status === 403 ? 'Success (Blocked)' : 'Fail');

  res = await request('GET', '/api/v1/clients', null, null);
  console.log('401 Test (No token fetching clients):', res.status, res.status === 401 ? 'Success (Blocked)' : 'Fail');
}

runTests().catch(console.error);
