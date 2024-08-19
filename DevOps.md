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
An easy and more secure way of setting up Jenkins in Docker is provided in [this documentation](https://www.jenkins.io/doc/book/installing/docker/)

### 1. Create a Docker Network for Jenkins
Create a docker network with the command: `docker network create jenkins_network`

### 2. Create Docker-in-Docker Container:
The container supposed to run the docker commands should have docker installed internally. <br>
For this purpose, docker dind image is used.<br>
Run the container in the same network using command: `docker run --name jenkins-docker -d --privileged --network jenkins_network --network-alias docker --env DOCKER_TLS_CERTDIR=/certs --env DOCKER_TLS_CERTDIR_HOSTNAMES=jenkins-docker --volume jenkins-docker-certs:/certs/client --volume jenkins-data:/var/jenkins_home --publish 2376:2376 --publish 3000:3000 --publish 8000:8000 docker:dind --storage-driver overlay2`

### 3. Create Jenkins Image:
The dockerfile for the Jenkins container is present as 'jenkins.Docker'.<br>
Create the image using the command: `docker build -f jenkins.Dockerfile -t myjenkins:latest .`<br>

### 4. Run the Jenkins Container:
Run the container in the same network using command: `docker run --name myjenkins --restart=on-failure -d --network jenkins_network --env DOCKER_HOST=tcp://docker:2376 --env DOCKER_CERT_PATH=/certs/client --env DOCKER_TLS_VERIFY=1 --volume jenkins-data:/var/jenkins_home --volume jenkins-docker-certs:/certs/client:ro --publish 8080:8080 myjenkins:latest`

#### Unlock Jenkins
Retrieve the initial admin password: `docker logs myjenkins`
or
`docker exec myjenkins cat /var/jenkins_home/secrets/initialAdminPassword`

<b> Note: If you want to use the container terminal, use the following command:`docker exec -it container-name sh`<br></b>

### 5. Creating the Jenkins Pipeline

#### Create a Pipeline
- In Jenkins container, create a new pipeline.
- Add the secrey key provided in local .env file of the backend application in the Jenkins credentials
- For testing purposes, paste the Jenkinsfile script directly into the pipeline script section.

#### Build the Pipeline
Trigger a build and monitor the console output.

### 6. Testing the application
To test the application on host system, comment the post part of pipeline script.