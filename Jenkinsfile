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
                    // התקנה ספציפית של חבילות בדיקה אם חסרות
                    bat 'npm install --save-dev @testing-library/react @testing-library/user-event jest-junit || echo "Already installed"'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('fitmap') {
                    // בצע בדיקות עם יצירת דוחות JUnit ודוח כיסוי
                    bat 'npm test -- --ci --coverage --testResultsProcessor=jest-junit'
                }
            }
            post {
                always {
                    // קליטת התוצאות כדוחות
                    junit 'fitmap/junit.xml'
                    publishHTML target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'fitmap/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'דוח כיסוי בדיקות'
                    ]
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
            echo 'Pipeline הושלם בהצלחה!'
        }
        failure {
            echo 'Pipeline נכשל, מציג לוגים:'
            dir('fitmap') {
                bat 'docker-compose -f ../docker-compose.yml logs'
            }
        }
    }
}