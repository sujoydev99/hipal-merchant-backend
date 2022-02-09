def build(){
  echo "Building application"
  withCredentials([usernamePassword(credentialsId: 'docker-hub-repo', passwordVariable: 'PASSWORD', usernameVariable: 'USER')]){
    sh 'docker build -t hipal/hipal:ver-test-2 .'
    sh 'echo $PASSWORD | docker login -u $USER --password-stdin'
    sh 'docker push hipal/hipal:ver-test-2'
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
  def dockerCmd = 'docker run -p 5001:5001 -d hipal/hipal'
  sh "ssh -o StrictHostKeyChecking=no prod@35.244.30.4 ${dockerCmd}"
  
}

return this