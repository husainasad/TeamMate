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

        GIT_REPO = 'https://github.com/husainasad/TeamMate.git'
        GIT_BRANCH = 'main'
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    deleteDir()
                    checkout([$class: 'GitSCM',
                              branches: [[name: "${env.GIT_BRANCH}"]],
                              userRemoteConfigs: [[url: "${env.GIT_REPO}"]]])
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

        stage('Setup Kubernetes Context') {
            steps {
                script {
                    sh "kubectl config use-context docker-desktop"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh "kubectl apply -f k8s/postgres-deployment.yaml"
                    sh "kubectl apply -f k8s/backend-deployment.yaml"
                    sh "kubectl apply -f k8s/frontend-deployment.yaml"
                }
            }
        }
    }

    post {
        always {
            script {
                sh """
                    docker rmi ${env.BACKEND_IMAGE} ${env.FRONTEND_IMAGE} ${env.POSTGRES_IMAGE} || true
                """
                sh "kubectl delete -f k8s/postgres-deployment.yaml || true"
                sh "kubectl delete -f k8s/backend-deployment.yaml || true"
                sh "kubectl delete -f k8s/frontend-deployment.yaml || true"
            }
        }
    }
}