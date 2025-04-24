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
                dir('fitmap') {
                    bat 'docker build -t fitmap-app --no-cache .'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                dir('fitmap') {
                    bat 'docker-compose up -d'
                    bat 'timeout /t 10'
                    bat 'docker-compose ps'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            dir('fitmap') {
                bat 'docker-compose down'
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            dir('fitmap') {
                bat 'docker-compose logs'
            }
        }
    }
} 
