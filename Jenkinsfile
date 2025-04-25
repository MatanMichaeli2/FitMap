pipeline {
    agent any

    environment {
        NODE_VERSION = '18.x'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                // inside your React app folder
                dir('fitmap') {
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('fitmap') {
                    bat 'npm test -- --passWithNoTests'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // run from workspace root so Dockerfile is found
                bat 'docker build -t fitmap-app --no-cache .'
            }
        }

        stage('Run Docker Container') {
            steps {
                // run from workspace root so docker-compose.yml is found
                bat 'docker-compose up -d'
                // give it a few seconds to start
                bat 'timeout /t 10'
                bat 'docker-compose ps'
            }
        }
    }

    post {
        always {
            // clean workspace and tear down any containers
            cleanWs()
            bat 'docker-compose down'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            bat 'docker-compose logs'
        }
    }
}
