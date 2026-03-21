pipeline {
    agent any

    environment {
        DOCKER_CREDS_ID = 'docker-cred'
        DOCKER_HUB_USER = '2023bcs0005anush'

        REGISTER = '2023_Batch_2'
        ROLL = '2023BCS0005'

        FRONTEND_IMAGE = "${DOCKER_HUB_USER}/${REGISTER}_${ROLL}_frontend"
        BACKEND_IMAGE  = "${DOCKER_HUB_USER}/${REGISTER}_${ROLL}_backend"

        TAG = "${env.BUILD_NUMBER}"

        EC2_USER = "ubuntu"
        EC2_HOST = "3.109.175.196"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                sh """
                docker build -t ${BACKEND_IMAGE}:${TAG} -t ${BACKEND_IMAGE}:latest ./backend
                docker build -t ${FRONTEND_IMAGE}:${TAG} -t ${FRONTEND_IMAGE}:latest ./frontend
                """
            }
        }

        stage('Test Containers') {
            steps {
                sh """
                docker rm -f test-backend-${TAG} || true
                docker rm -f test-frontend-${TAG} || true

                docker run -d --name test-backend-${TAG} -p 9000:5000 ${BACKEND_IMAGE}:${TAG}
                sleep 5
                docker rm -f test-backend-${TAG}

                docker run -d --name test-frontend-${TAG} -p 9001:80 ${FRONTEND_IMAGE}:${TAG}
                sleep 5
                docker rm -f test-frontend-${TAG}
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKER_CREDS_ID,
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                    echo \$PASS | docker login -u \$USER --password-stdin

                    docker push ${BACKEND_IMAGE}:${TAG}
                    docker push ${BACKEND_IMAGE}:latest

                    docker push ${FRONTEND_IMAGE}:${TAG}
                    docker push ${FRONTEND_IMAGE}:latest

                    docker logout
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "

                    cd ~

                    docker pull ${BACKEND_IMAGE}:latest
                    docker pull ${FRONTEND_IMAGE}:latest

                    docker-compose down --remove-orphans || true
                    docker image prune -f
                    docker-compose up -d --force-recreate

                    "
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()

            sh "docker rmi ${BACKEND_IMAGE}:${TAG} || true"
            sh "docker rmi ${FRONTEND_IMAGE}:${TAG} || true"
        }

        success {
            echo "Pipeline SUCCESS"
        }

        failure {
            echo "Pipeline FAILED"
        }
    }
}
