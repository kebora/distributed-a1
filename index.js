const express = require('express')
const app = express()
const port = 3000

const { removeReplicas } = require('./delete-function')

const K = 9 // Number of virtual servers per server container

// Hash function
function hash(key) {
    return key + (2 * key) + 17;
}
//

function virtualServerIn(serverIndex, virtualServerId) {
    return (serverIndex + virtualServerId + (2 * virtualServerId) + 25) % hashRing.length;
}

const serverString = "Server 1, Server 2, Server 3, S5, S4, S10, S11";
const servers = serverString.split(",").map(server =>
    ({ handleHomeRequest: (req, res) => { res.send("Hello from " + server.trim()); } }));

// Initialize hashRing with size 512 and fill with -1
const hashRing = new Array(512).fill(-1);

// Add virtual servers
for (let serverIndex = 0; serverIndex < servers.length; serverIndex++) {
    for (let virtualServerId = 0; virtualServerId < K; virtualServerId++) {
        let vsi  = virtualServerIn(serverIndex, virtualServerId);
        hashRing[vsi] = servers[serverIndex];
    }
}

// Handle requests using serverForRequest function
app.get('/home', (req, res) => {
    const server = serverForRequest(req.query.key);
    if (server) {
        server.handleHomeRequest(req, res);
    } else {
        res.status(503).send("Server currently unavailable");
    }
});
//
// Endpoint (/add, method=POST): Add new server replicas
app.post('/add', async (req, res) => {
    try {
        const payload = req.body;
        const { n, hostnames } = payload;

        if (!n || typeof n !== 'number' || n <= 0) {
            return res.status(400).send({ message: 'Invalid number of new instances' });
        }

        if (hostnames && hostnames.length > n) {
            return res.status(400).send({ message: 'Hostname list cannot be longer than new instances' });
        }

        const addedCount = 0;
        for (let i = 0; i < n; i++) {
            const hostname = hostnames ? hostnames[i] || generateRandomHostname() : generateRandomHostname();
            await spawnServerContainer(hostname);
            addedCount++;
        }

        // Update hashRing with new servers
        for (let serverIndex = 0; serverIndex < servers.length; serverIndex++) {
            for (let virtualServerId = 0; virtualServerId < K; virtualServerId++) {
                const virtualServerIndex = virtualServerIndex(serverIndex, virtualServerId);
                if (hashRing[virtualServerIndex] === -1) {
                    hashRing[virtualServerIndex] = servers[serverIndex];
                    break; // Only assign one server per slot
                }
            }
        }

        const remainingReplicas = servers.map(server => server.hostname);
        res.status(200).send({
            message: {
                N: remainingReplicas.length,
                replicas: remainingReplicas,
            },
            status: 'successful',
        });
    } catch (error) {
        console.error("Error adding server replicas:", error);
        res.status(500).send({ message: 'Error adding replicas' });
    }
});
//
// Endpoint (/<path>, method=GET): Route requests using consistent hashing
app.get('/:path', async (req, res) => {
    const path = req.params.path; // Extract path from the request
    const key = hash(path); // Hash the path for consistent hashing
    let serverIndex = key % hashRing.length;
    let probes = 0;

    // Loop until finding a server or exceeding a limit
    while (probes < K && (hashRing[serverIndex] === -1 || !hashRing[serverIndex].internalAddress)) {
        serverIndex = (serverIndex + 1) % hashRing.length;
        probes++;
    }

    if (probes >= K) {
        return res.status(503).send({ message: 'No available server found' });
    }

    const server = hashRing[serverIndex];
    const serverAddress = server.internalAddress;
    const serverPort = port; // Same port for all servers

    const serverHostname = server.hostname;

    // Increment request count for chosen server
    if (!serverRequestCounts[serverHostname]) {
      serverRequestCounts[serverHostname] = 0;
    }
    serverRequestCounts[serverHostname]++;

    // Forward request to chosen server
    req.pipe(
        request(`http://${serverAddress}:${serverPort}/${path}`),
        { end: false }
    ).pipe(res);
});

function serverForRequest(key) {
    const hashedKey = hash(key);
    let serverIndex = hashedKey % hashRing.length;
    let probes = 0;

    // Loop until finding an available server or exceeding a limit
    while (probes < K && (hashRing[serverIndex] === -1 || hashRing[serverIndex] === null)) {
        serverIndex = (serverIndex + 1) % hashRing.length;
        probes++;
    }

    return probes === K ? null : hashRing[serverIndex];
}

// Heartbeat Route
app.get('/heartbeat', (req, res) => {
    res.sendStatus(200);
});

// delete endpoint: logic defined in ./delete-function.js
app.delete('/rm', removeReplicas);

// Endpoint (/rep, method=GET): Get replica status
app.get('/rep', (req, res) => {
    const replicas = servers.map(server => ({ hostname: server.hostname, internalAddress: server.internalAddress }));
    res.status(200).send({
        message: {
            N: replicas.length,
            replicas,
        },
        status: 'successful',
    });
});

//
app.listen(port, () => {
    console.log("app currently listening on port: " + port);
});
