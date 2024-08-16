# CI/CD Pipeline Setup for TaskManager Application
This guide explains how to containerize the TaskManager application and integrate Jenkins for a CI/CD pipeline. The application consists of three main components: PostgreSQL database, Django backend, and React frontend. Each component will be containerized separately and managed through Jenkins.

## Local Testing

### 1. Create a Docker Network (Optional)
Create a dedicated Docker network for seamless communication: `docker network create taskManager_network`

### 2. Containerize the PostgreSQL Database
Use the official PostgreSQL image to set up the database container: `docker run -d --name postgres-db --network taskManager_network -e POSTGRES_DB=taskManagerDB -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`

### 3. Containerize the Django Backend

#### Build the Django Backend Image
The dockerfile for the application backend is present as 'backend.Docker' in the backend app folder.<br>
Create the image using the command: `docker build -f backend.Dockerfile -t taskmanager-backend-image .`<br>

<b> Note: If you encounter the error docker-credential-wincred.exe: executable file not found in %PATH%, change "credsStore" to "credStore".<br></b>
<b> Note: If there is an issue installing psycopg2, replace it with psycopg2-binary.<br></b>

#### Run the Django Backend Container
Run the container in the same network using command: `docker run -d --name taskManager-backend --network taskManager_network -p 8000:8000 taskmanager-backend-image`

### 4. Containerize the React Frontend

#### Build the React Frontend Image
The dockerfile for the application frontend is present as 'frontend.Docker' in the frontend app folder.<br>
Create the image using the command: `docker build -f frontend.Dockerfile -t taskmanager-frontend-image .`<br>

#### Run Django Frontend Container
Run the container in the same network using command: `docker run -d --name taskManager-frontend --network taskManager_network -p 3000:3000 taskmanager-frontend-image`

## Integrating Jenkins
The next step is to set up Jenkins to automate the CI/CD pipeline.<br>
We'll use a Jenkins Controller-Agent setup where the Controller manages the pipeline and the Agent(s) handle building images and running containers.<br>

### 1. Create a Docker Network for Jenkins
Create a docker network with the command: `docker network create jenkins_network`

### 2. Containerize the Jenkins Controller
Use the official Jenkins image to create the Controller container: `docker run -d --name jenkins-controller --network jenkins_network -p 8080:8080 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts`

#### Unlock Jenkins
RRetrieve the initial admin password: `docker logs jenkins-container-name`
or
`docker exec jenkins-container-name cat /var/jenkins_home/secrets/initialAdminPassword`

<b> Note: If you want to use the container terminal, use the following command:`docker exec -it container-name sh`<br></b>

#### Plugin Installation
During setup, allow Jenkins to install the recommended plugins. Ensure the following plugins are installed:
- Docker Pipeline
- Git
- Pipeline

#### [Optional] Install Docker in Jenkins Controller
If needed, install Docker within the Jenkins container:
```
docker exec -it --user root container-name sh
apt-get update
apt-get install -y docker.io
```

### 3. Configure a Jenkins Agent Node

#### Create a new Node
- Name the node (e.g., jenkins-agent) and select "Permanent Agent".
- Specify the root directory (e.g., /home/jenkins/agent).
- Add a label (e.g., docker-agent) for identification.
- Save the node.
- Retrieve the secret key from the launch page to launch the Jenkins Agent.

### 4. Setting up Jenkins Agents

#### Build the Jenkins Agent Image
In order to create and set up the Jenkins Agent, use the 'jenkins-agent.Dockerfile' to create the image.
Use the command:`docker build -f jenkins-agent.Dockerfile -t jenkins-agent-docker:latest .`

#### Run the Jenkins Agent Container
Start the Agent container:
```
docker run -d --name jenkins-agent --network jenkins_network -v /var/run/docker.sock:/var/run/docker.sock -v /home/jenkins/agent:/home/jenkins/agent jenkins-agent-docker:latest -url http://jenkins-controller:8080 -secret <secret-key> -name jenkins-agent
```

Ensure the following plugins are installed:
- SSH Build Agents
- Node and Label Parameter

### 5. Creating the Jenkins Pipeline

#### Create a Pipeline
- In Jenkins Controller, create a new pipeline.
- Add the secrey key provided in local .env file of the backend application in the Jenkins credentials
- For testing purposes, paste the Jenkinsfile script directly into the pipeline script section.

#### Build the Pipeline
Trigger a build and monitor the console output.

### Troubleshooting

#### Docker Daemon Issues
If you encounter Docker daemon-related errors:
```
service --status-all
service docker start
ls -ld /home/jenkins/agent
chown -R 1000:1000 /home/jenkins/agent
docker restart jenkins-agent
```

#### Docker Socket Issues
If there are issues related to Docker socket permissions:
```
chown root:docker /var/run/docker.sock
chmod 660 /var/run/docker.sock
docker restart jenkins-agent
```
### Set up Jenkins in Docker [Alternate]
An easier and more secure way of setting up Jenkins in Docker is provided in [this documentation](https://www.jenkins.io/doc/book/installing/docker/)

Step 1:
```
docker run --name jenkins-docker -d --privileged --network jenkins_network --network-alias docker --env DOCKER_TLS_CERTDIR=/certs --env DOCKER_TLS_CERTDIR_HOSTNAMES=jenkins-docker --volume jenkins-docker-certs:/certs/client --volume jenkins-data:/var/jenkins_home --publish 2376:2376 docker:dind --storage-driver overlay2
```

Step 2:
```
docker build -f jenkins.Dockerfile -t myjenkins:2.462.1-1 .
```
Step 3:
```
docker run --name myjenkins --restart=on-failure -d --network jenkins_network --env DOCKER_HOST=tcp://docker:2376 --env DOCKER_CERT_PATH=/certs/client --env DOCKER_TLS_VERIFY=1 --volume jenkins-data:/var/jenkins_home --volume jenkins-docker-certs:/certs/client:ro --publish 8080:8080 --publish 50000:50000 myjenkins:2.462.1-1
```