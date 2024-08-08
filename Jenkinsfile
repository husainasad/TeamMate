pipeline {
    agent any

    environment {
        DOCKER_NETWORK = 'taskManager_network'
        POSTGRES_IMAGE = 'postgres:latest'
        POSTGRES_CONTAINER = 'postgres-db'
        POSTGRES_DB = 'taskManagerDB'
        POSTGRES_USER = 'postgres'
        POSTGRES_PASSWORD = 'postgres'
        BACKEND_IMAGE = 'taskmanager-backend-image'
        BACKEND_CONTAINER = 'taskManager-backend'
        FRONTEND_IMAGE = 'taskmanager-frontend-image'
        FRONTEND_CONTAINER = 'taskManager-frontend'
    }

    stages {
        stage('Setup Network') {
            steps {
                script {
                    sh "docker network create ${env.DOCKER_NETWORK} || true"
                }
            }
        }
        stage('Run Database') {
            steps {
                script {
                    sh """
                        docker run -d --name ${env.POSTGRES_CONTAINER} --network ${env.DOCKER_NETWORK} \
                        -e POSTGRES_DB=${env.POSTGRES_DB} \
                        -e POSTGRES_USER=${env.POSTGRES_USER} \
                        -e POSTGRES_PASSWORD=${env.POSTGRES_PASSWORD} \
                        -p 5432:5432 ${env.POSTGRES_IMAGE}
                    """
                }
            }
        }
        stage('Build Backend') {
            steps {
                script {
                    sh "docker build -f TeamMate_DJ/backend.Dockerfile -t ${env.BACKEND_IMAGE} ."
                }
            }
        }
        stage('Run Backend') {
            steps {
                script {
                    sh """
                        docker run -d --name ${env.BACKEND_CONTAINER} --network ${env.DOCKER_NETWORK} \
                        -p 8000:8000 ${env.BACKEND_IMAGE}
                    """
                }
            }
        }
        stage('Build Frontend') {
            steps {
                script {
                    sh "docker build -f teammate_react/frontend.Dockerfile -t ${env.FRONTEND_IMAGE} ."
                }
            }
        }
        stage('Run Frontend') {
            steps {
                script {
                    sh """
                        docker run -d --name ${env.FRONTEND_CONTAINER} --network ${env.DOCKER_NETWORK} \
                        -p 3000:3000 ${env.FRONTEND_IMAGE}
                    """
                }
            }
        }
    }
    post {
        always {
            script {
                sh """
                    docker stop ${env.FRONTEND_CONTAINER} ${env.BACKEND_CONTAINER} ${env.POSTGRES_CONTAINER} || true
                    docker rm ${env.FRONTEND_CONTAINER} ${env.BACKEND_CONTAINER} ${env.POSTGRES_CONTAINER} || true
                    docker rmi ${env.BACKEND_IMAGE} ${env.FRONTEND_IMAGE} ${env.POSTGRES_IMAGE} || true
                    docker network rm ${env.DOCKER_NETWORK} || true
                """
            }
        }
    }
}