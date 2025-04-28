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
                    // בנייה של image דוקר
                    bat 'docker build -t fitmap-app --no-cache -f ../Dockerfile .'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                dir('fitmap') {
                    // הרצת הקונטיינר
                    bat 'docker-compose -f ../docker-compose.yml up -d'

                    // המתנה לעליית הקונטיינר
                    bat 'powershell -Command "Start-Sleep -Seconds 10"'

                    // הצגת רשימת קונטיינרים פעילים
                    bat 'docker-compose -f ../docker-compose.yml ps'
                    
                    // בדיקה שהאפליקציה עובדת באמצעות curl
                    bat 'curl -s -o nul -w "%%{http_code}" http://localhost:3000 || echo "Application health check failed"'
                }
            }
        }
    }

    post {
        always {
            // סיום הרצת הקונטיינרים וניקוי סביבת העבודה
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