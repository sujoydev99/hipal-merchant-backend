def build(){
  echo "Building application"
  withCredentials([usernamePassword(credentialsId: 'docker-hub-repo', passwordVariable: 'PASSWORD', usernameVariable: 'USER')]){
    sh 'docker build -t hipal/hipal:ver-test .'
    sh 'echo $PASSWORD | docker login -u $USER --password-stdin'
    sh 'docker push hipal/hipal:ver-test'
  }
}

def dev(){
  echo "Deployed in ${ENV} environment"
}

def staging(){
  echo "Deployed in ${ENV} environment"
}

def prod(){
  echo "Deployed in ${ENV} environment"
}

return this