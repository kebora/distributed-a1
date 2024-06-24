exports.removeReplicas = async (req, res) => {
    try {
        // Endpoint (/rm, method=DELETE) to remove server replicas
        app.delete('/rm', async (req, res) => {
            try {
                const payload = req.body;
                const { n, hostnames } = payload;

                if (!n || typeof n !== 'number' || n <= 0) {
                    return res.status(400).send({ message: 'Invalid number of replicas to remove' });
                }

                if (hostnames && hostnames.length > n) {
                    return res.status(400).send({ message: 'Hostname list cannot be longer than replicas to remove' });
                }

                let removedCount = 0;
                const randomRemovals = [];

                // Remove specified hostnames
                for (const hostname of hostnames || []) {
                    const serverIndex = servers.findIndex(server => server.hostname === hostname);
                    if (serverIndex !== -1) {
                        await removeServerContainer(hostname);
                        servers.splice(serverIndex, 1);
                        removedCount++;
                    } else {
                        console.warn(`Server container ${hostname} not found for removal`);
                    }
                }

                // Remove remaining instances randomly if needed
                while (removedCount < n) {
                    const randomIndex = Math.floor(Math.random() * servers.length);
                    const randomServer = servers[randomIndex];
                    await removeServerContainer(randomServer.hostname);
                    servers.splice(randomIndex, 1);
                    randomRemovals.push(randomServer.hostname);
                    removedCount++;
                }

                // Update hashRing with removed servers
                for (let i = 0; i < hashRing.length; i++) {
                    if (hashRing[i] && removedCount > 0) {
                        const serverIndex = servers.findIndex(server => server.hostname === hashRing[i].hostname);
                        if (serverIndex === -1) {
                            hashRing[i] = -1;
                            removedCount--;
                        }
                    }
                }

                const remainingReplicas = servers.map(server => server.hostname);
                res.status(200).send({
                    message: {
                        N: remainingReplicas.length,
                        replicas: [...remainingReplicas, ...randomRemovals], // Include randomly removed servers in response
                    },
                    status: 'successful',
                });
            } catch (error) {
                console.error("Error removing server replicas:", error);
                res.status(500).send({ message: 'Error removing replicas' });
            }
        });

    } catch (error) {
        res.status(500).send({ message: 'Error removing replicas' });
    }
};