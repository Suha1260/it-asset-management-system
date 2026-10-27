pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm.cmd install'
            }
        }

        stage('Syntax Check') {
            steps {
                bat 'node --check server.js'
            }
        }

        stage('Automated Tests') {
            steps {
                bat 'npm.cmd test'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t it-asset-management:latest .'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
