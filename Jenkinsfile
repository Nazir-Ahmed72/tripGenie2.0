pipeline {
    agent any

    triggers { githubPush() }

    environment {
        COMPOSE_FILE = 'docker-compose.jenkins.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Nazir-Ahmed72/tripGenie2.0.git'
            }
        }

        stage('Pull base images') {
            steps {
                script {
                    ['postgres:16-alpine', 'node:20-alpine', 'python:3.11-slim', 'nginx:alpine'].each {
                        docker.image(it).pull()
                    }
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                withCredentials([file(credentialsId: 'tripgenie-env', variable: 'ENV_FILE')]) {
                    sh '''
                        cp "$ENV_FILE" .env
                        docker compose -f $COMPOSE_FILE down --remove-orphans
                        docker compose -f $COMPOSE_FILE up -d
                    '''
                }
            }
        }

        stage('Health check') {
            steps {
                sh '''
                    for i in $(seq 1 30); do
                        if curl -sf http://localhost:4000 > /dev/null && curl -sf http://localhost:6001/health; then
                            echo "App is up"; exit 0
                        fi
                        sleep 5
                    done
                    docker compose -f $COMPOSE_FILE logs --tail=50
                    exit 1
                '''
            }
        }
    }

    post {
        always {
            script {
                env.COMMIT_EMAIL = sh(script: 'git log -1 --pretty=%ae || true', returnStdout: true).trim()
            }
            emailext(
                to: "${env.COMMIT_EMAIL}",
                recipientProviders: [developers()],
                subject: "TripGenie build #${env.BUILD_NUMBER}: ${currentBuild.currentResult}",
                body: """Build result: ${currentBuild.currentResult}
Job: ${env.JOB_NAME} #${env.BUILD_NUMBER}
Pushed by: ${env.COMMIT_EMAIL}
App: http://YOUR_ELASTIC_IP:4000
Console: ${env.BUILD_URL}console""",
                attachLog: true
            )
        }
    }
}
