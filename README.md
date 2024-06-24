#Part 1: How to launch the server
* Open postman
* Send a GET request to:
    http://localhost:3000/home?key=”HelloServer”
* Open the Terminal and use the following command:
    Curl http://localhost:3000/home?key=”HelloServer”
//
The server responds with a message: 
Hello from server k, where k is an integer representation of the server.
As highlighted in the code:
`const serverString = "Server 1, Server 2, Server 3, S5, S4, S10, S11";`
//
#Part 2: Analysis
If 10000 requests are made to 3 server containers, it is viewed that with load balancing, the requests are approximately distributed using the following equation.
Number of requests/ [No. of server containers]
= 10000/3 
Approx. 3333 requests per server

![load balancing across the different values of N](/chart%20(1).png)

The chart above also highlights the values of N when extended to 6.

When the number of servers increase, it is observed that the load per server decreases. This is an expected outcome assuming the same formula as depicted above. This implies a successful load balancing operation.
