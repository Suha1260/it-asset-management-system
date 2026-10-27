pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install dependencies') {
      steps { sh 'npm install' }
    }
    stage('Syntax check') {
      steps { sh 'node --check server.js' }
    }
    stage('Build Docker image') {
      steps { sh 'docker build -t it-asset-management:latest .' }
    }
  }
  post {
    success { echo 'Pipeline completed successfully.' }
    failure { echo 'Pipeline failed. Check the stage logs.' }
  }
}
