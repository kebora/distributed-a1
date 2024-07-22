# Customizable Load Balancer 

## Project Overview 

Load balancers are critical for managing multiple server replicas in distributed systems and ensuring that client requests are distributed evenly across servers. This project involves the following tasks:

1. **Server Implementation**: Create a simple web server that handles HTTP requests.
2. **Consistent Hashing**: Develop a consistent hashing mechanism to distribute load effectively.
3. **Load Balancer Implementation**: Implement a load balancer that uses consistent hashing to manage server replicas.
4. **Performance Analysis**: Test the performance of the load balancer.

The primary goal is to develop a scalable and fault-tolerant system that maintains a consistent load distribution even as server instances are dynamically added or removed.

## Installation Instructions
### Prerequisites

Ensure that you have the following software installed on your system:

- **Docker**: Version 20.10.23 or higher  ([How to install Docker](https://www.docker.com/get-started/))
- **Python**: Python 3.0 or higher
- **Make** (Optional)

### Steps 

1. **Clone the Repository**

  ```bash
   git clone https://github.com/kebora/distributed-a1.git
   cd distributed-a1
```
2. **Build Server Docker Image**


  ```bash
   docker build -t server:latest server/
```

3. **Deploy the System using Docker Compose**


  ```bash
   docker compose up
```

or you can use the included makefile by running:

  ```bash
   make run
```
## Usage Guidelines

Once the system is up and running, you can interact with the load balancer using the following endpoints:

- **GET /home**: Retrieves a message from a server replica.
- **GET /heartbeat**: Sends a heartbeat response to check the server status.
- **GET /rep**: Returns the status of the replicas managed by the load balancer.
- **POST /add**: Adds new server instances to the load balancer.

    This endpoints accepts a JSON payload defining the number of server instances being added and their names as below:
  ```json
    {"n": 2, "hostnames": ["Server4", "Server5"]}
   ```
- **DELETE /rm**: Removes server instances from the load balancer.

### Example Requests

**Get Server Message**
  ```bash
     curl http://localhost:5000/home
```
**Add New Server Instances**
  ```bash
     curl -X POST -H "Content-Type: application/json" -d '{"n": 2, "hostnames": ["Server4", "Server5"]}' http://localhost:5000/add
```

**Remove Server Instances**
  ```bash
     curl -X DELETE -H "Content-Type: application/json" -d '{"n": 1, "hostnames": ["Server4"]}' http://localhost:5000/rm
```
## Testing

### Running Tests
The Load Balancer tests are stored in the ` tests\` directory and can be run by excecuting:

  ```bash
pytest tests/test.py
```
## Performance Analysis

### Experiment 1: Load Distribution

- Launch 10,000 asynchronous requests on 3 server containers.
- Record the number of requests handled by each server and plot a bar chart.
- Expected Outcome: Even distribution of load among server instances.

![image](https://private-user-images.githubusercontent.com/65071563/342639360-4dd71147-b598-42a7-94d0-7633673374da.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjE2Mzc2MjYsIm5iZiI6MTcyMTYzNzMyNiwicGF0aCI6Ii82NTA3MTU2My8zNDI2MzkzNjAtNGRkNzExNDctYjU5OC00MmE3LTk0ZDAtNzYzMzY3MzM3NGRhLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA3MjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNzIyVDA4MzUyNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWM4NWVjYmM5ODExODQ2MTlmN2JmOTY3OWI2ZDQ3YWUxZTY5NzIxMzFmNTk1YjYyYWQ3NzQ0N2Y3ZWM2NjlmYjUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.tNaebDOdtgWx3nsW9ro0WVPHbBYRSZS8JIx87XZqKGQ)



### Experiment 2: Scalability

- Increment the number of server containers from 2 to 6 (launching 10,000 requests each time).
- Plot a line chart showing the average load of the servers at each run.
- Expected Outcome: Efficient scaling with even load distribution as server instances increase.
![image](https://private-user-images.githubusercontent.com/65071563/342661105-23d841b0-bdba-46a0-8081-cbdeffd12231.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjE2Mzc2MjYsIm5iZiI6MTcyMTYzNzMyNiwicGF0aCI6Ii82NTA3MTU2My8zNDI2NjExMDUtMjNkODQxYjAtYmRiYS00NmEwLTgwODEtY2JkZWZmZDEyMjMxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA3MjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNzIyVDA4MzUyNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTY5ZGY1NTRkMjlmZTVhYmJmY2UwNmIzY2UwNDk0ZDIyYTkxOGEzZTBiOWFkY2FiMGUxZGIxZmQ5ZjMyZWE5MDYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.rN83U3pcqfVmfYsPrBvUoUfXfMcRvrKZ4KZxJB7ctEo)


### Experiment 3: Failure Recovery

- Test load balancer endpoints and simulate server failures.
- Ensure the load balancer spawns new instances to handle the load and maintain the specified number of replicas.
#### Results
![image](https://private-user-images.githubusercontent.com/65071563/342691161-ea80a5f6-2081-45c9-b1f2-7c91d355efb7.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjE2Mzc2MjYsIm5iZiI6MTcyMTYzNzMyNiwicGF0aCI6Ii82NTA3MTU2My8zNDI2OTExNjEtZWE4MGE1ZjYtMjA4MS00NWM5LWIxZjItN2M5MWQzNTVlZmI3LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA3MjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNzIyVDA4MzUyNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTY1OTNlNWNjNWJiZjAyZWVhODdhNjZkMjkwNzhlNWVkYmZjZDcwNWJjNDg3NTU1NmQ4YmIxZjdlYzM0MjRjNDImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.R1HbFg-9ztrzswoNVjhvEcT30h757j6AuIGe2jE3Lxc)
<br>
<sup>Containers  with the prefix 'emergency_' are spawned on failure of a replica.</sup>
- On failure of 'S2' and 'S4' replica 'emergency_58' and 'emergency_43' are spawned

### Experiment 4: Hash Function Modification

- Modified the hash function: i % 512(number) of slots.
- Repeat experiments 1 and 2, analyzing the impact on load distribution and scalability.
- #### Experiment 1 Results:
  ![image](https://private-user-images.githubusercontent.com/65071563/342652616-37fe90b7-d576-4410-a0a6-e067ff4d67d2.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjE2Mzc2MjYsIm5iZiI6MTcyMTYzNzMyNiwicGF0aCI6Ii82NTA3MTU2My8zNDI2NTI2MTYtMzdmZTkwYjctZDU3Ni00NDEwLWEwYTYtZTA2N2ZmNGQ2N2QyLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA3MjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNzIyVDA4MzUyNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTI3YTBkMTczNjQ4MTc2MDU2NzI3YTM4YTczNDkwMzQwYjliNWUxMzA4ZDY4MmJjNzI4ZDI1ZGViMjk3MmY5NzImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.c9va1cmDw1Jl9OuGB0Za665TP36T1OU17wnZFdQn874)
- #### Experiment 2 Results:
  ![image](https://private-user-images.githubusercontent.com/65071563/342658040-2fd094d2-4883-4b0d-a732-06be19a3ee14.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjE2Mzc2MjYsIm5iZiI6MTcyMTYzNzMyNiwicGF0aCI6Ii82NTA3MTU2My8zNDI2NTgwNDAtMmZkMDk0ZDItNDg4My00YjBkLWE3MzItMDZiZTE5YTNlZTE0LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA3MjIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNzIyVDA4MzUyNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWFlMjkzMjJhNzU4N2FkOGU0MWUxM2IzZWNjYzUxMGQwMzg5YTg5NGU5ZDliMTRhYzkyMjkzNTg5ZWM3YmVlMjgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.uwrY-u22tjVFLXj7nmJJMEQblY9QdeJeD3AVB29BB0A)


