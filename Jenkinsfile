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

        stage('Build') {
            steps {
                dir('fitmap') {
                    bat 'npm run build -- --verbose'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            echo 'Build error details:'
            dir('fitmap') {
                bat 'type build\\logs\\error.log 2>nul || echo No error log found'
            }
        }
    }
} 
