## Steps to create CICD pipeline for the project

### Containerize the Application
The application consists of various components including backend, frontend and the database, all of which need to be containerized separately.

#### [Optional] Create a Docker Network
Use the command `docker network create taskManager_network`

#### Containerize the PostgreSQL database
Since PostgreSQL already has an official image, we can use that.<br>
The command to create the container is: 
`docker run -d --name postgres-db --network taskManager_network -e POSTGRES_DB=taskManagerDB -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres`

#### Containerize the Django Backend
To containerize the backend application, first create the image using dockerfile and then run a container from that image

##### Create Django Backend Image
The dockerfile for the application backend is present as 'backend.Docker' in the backend app folder.<br>
Create the image using the command: `docker build -f backend.Dockerfile -t taskmanager-backend-image .`<br>
<b> Note: If you get the error "docker-credential-wincred.exe": executable file not found in %PATH%", change "credsStore" with "credStore"<br></b>
<b> Note: If you face error in installing psycopg2 requirement, replace it with psycopg2-binary<br></b>

##### Run Django Backend Container
Run the container in the same network using command: `docker run -d --name taskManager-backend --network taskManager_network -p 8000:8000 taskmanager-backend-image`

#### Containerize the React Frontend
To Containerize the frontend application, first create the image using dockerfile and then run a container from that image

##### Create Django Frotend Image
The dockerfile for the application frontend is present as 'frontend.Docker' in the frontend app folder.<br>
Create the image using the command: `docker build -f frontend.Dockerfile -t taskmanager-frontend-image .`<br>

##### Run Django Frontend Container
Run the container in the same network using command: `docker run -d --name taskManager-frontend --network taskManager_network -p 3000:3000 taskmanager-frontend-image`