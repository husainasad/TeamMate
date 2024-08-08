## Steps to create CICD pipeline for the project

### Containerize the Application
The application consists of various components including backend, frontend and the database, all of which need to be containerized separately.

#### [Optional] Create a Docker Network
Use the command `docker network create taskManager_network`

#### Containerize the PostgreSQL database
PostgreSQL has an official image that we can use.<br>
The command to create the container is: 
`docker run -d --name postgres-db --network taskManager_network -e POSTGRES_DB=taskManagerDB -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`

#### Containerize the Django Backend
To containerize the backend application, follow these steps:

##### Create Django Backend Image
The dockerfile for the application backend is present as 'backend.Docker' in the backend app folder.<br>
Create the image using the command: `docker build -f backend.Dockerfile -t taskmanager-backend-image .`<br>
<b> Note: If you get the error "docker-credential-wincred.exe": executable file not found in %PATH%", change "credsStore" with "credStore"<br></b>
<b> Note: If you face error in installing psycopg2 requirement, replace it with psycopg2-binary<br></b>

##### Run Django Backend Container
Run the container in the same network using command: `docker run -d --name taskManager-backend --network taskManager_network -p 8000:8000 taskmanager-backend-image`

#### Containerize the React Frontend
To containerize the frontend application, follow these steps:

##### Create Django Frotend Image
The dockerfile for the application frontend is present as 'frontend.Docker' in the frontend app folder.<br>
Create the image using the command: `docker build -f frontend.Dockerfile -t taskmanager-frontend-image .`<br>

##### Run Django Frontend Container
Run the container in the same network using command: `docker run -d --name taskManager-frontend --network taskManager_network -p 3000:3000 taskmanager-frontend-image`

### Containerize Jenkins
Jenkins has an official image that we can use.<br>
The command to create the container is: 
`docker run -d --name jenkins --network taskManager_network -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts`

#### Unlock Jenkins
Retrieve the password with: using the command: `docker logs jenkins-container-name`
or
`docker exec jenkins-container-name cat /var/jenkins_home/secrets/initialAdminPassword`

#### Plugin Installation
Allow Docker to install the recommended plugins. Ensure the following plugins are installed:
- Docker Pipeline
- Git
- Pipeline