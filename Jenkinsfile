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
        BACKEND_PORT = '8000'

        FRONTEND_IMAGE = 'taskmanager-frontend-image'
        FRONTEND_CONTAINER = 'taskManager-frontend'
        FRONTEND_PORT = '3000'

        // GIT_REPO = 'https://github.com/husainasad/TeamMate.git'
        // GIT_BRANCH = 'main'
    }

    stages {
        // stage('Checkout Code') {
        //     steps {
        //         script {
        //             deleteDir()
        //             checkout([$class: 'GitSCM',
        //                       branches: [[name: "${env.GIT_BRANCH}"]],
        //                       userRemoteConfigs: [[url: "${env.GIT_REPO}"]]])
        //         }
        //     }
        // }

        stage('Setup Network') {
            steps {
                script {
                    sh "docker network inspect ${env.DOCKER_NETWORK} >/dev/null 2>&1 || docker network create ${env.DOCKER_NETWORK}"
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

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            sh "docker build -f TeamMate_DJ/backend.Dockerfile -t ${env.BACKEND_IMAGE} TeamMate_DJ"
                        }
                    }
                }

                stage('Build Frontend') {
                    steps {
                        script {
                            sh "docker build -f teammate_react/frontend.Dockerfile -t ${env.FRONTEND_IMAGE} teammate_react"
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            parallel {
                stage('Deploy Backend') {
                    steps {
                        withCredentials([string(credentialsId: 'SECRET_KEY', variable: 'BACKEND_SECRET_KEY')]) {
                            script {
                                sh """
                                    docker run -d --name ${env.BACKEND_CONTAINER} --network ${env.DOCKER_NETWORK} \
                                    -e SECRET_KEY="${BACKEND_SECRET_KEY}" \
                                    -p ${env.BACKEND_PORT}:${env.BACKEND_PORT} ${env.BACKEND_IMAGE}
                                """
                            }
                        }
                    }
                }

                stage('Deploy Frontend') {
                    steps {
                        script {
                            sh """
                                docker run -d --name ${env.FRONTEND_CONTAINER} --network ${env.DOCKER_NETWORK} \
                                -p ${env.FRONTEND_PORT}:${env.FRONTEND_PORT} ${env.FRONTEND_IMAGE}
                            """
                        }
                    }
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
                """

                sh """
                    docker rmi ${env.BACKEND_IMAGE} ${env.FRONTEND_IMAGE} ${env.POSTGRES_IMAGE} || true
                """

                sh "docker network inspect ${env.DOCKER_NETWORK} >/dev/null 2>&1 && docker network rm ${env.DOCKER_NETWORK} || true"
            }
        }
    }
}