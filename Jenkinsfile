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
                    // We're in fitmap/, so package.json is present
                    // -f ../Dockerfile points at the real Dockerfile one level up
                    bat 'docker build -t fitmap-app --no-cache -f ../Dockerfile .'
                }
            }
        }

stage('Run Docker Container') {
  steps {
    dir('fitmap') {
      // bring up the container
      bat 'docker-compose -f ../docker-compose.yml up -d'

      // wait 10 seconds without needing stdin
      bat 'powershell -Command "Start-Sleep -Seconds 10"'

      // then list running containers
      bat 'docker-compose -f ../docker-compose.yml ps'
    }
  }
}


    post {
        always {
            // teardown any running containers and clean workspace
            dir('fitmap') {
                bat 'docker-compose -f ../docker-compose.yml down'
            }
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed, dumping logs:'
            dir('fitmap') {
                bat 'docker-compose -f ../docker-compose.yml logs'
            }
        }
    }
}
