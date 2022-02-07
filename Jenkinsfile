def gv

pipeline {
  agent any 

  stages{

    stage("init"){
      steps {
        script {
          gv = load "scripts.groovy"
        }
      }
      
    }

    stage("build"){

      steps{
        script {

          gv.build()

          env.ENV = input message: "Select the environment" ok "Done"
          parameters: [choice(name: 'environment', choices: ["dev", "staging", "prod"], description: "Deploy build in selected environment" )]
        }
      }
    }

    stage("dev"){
      when {
        experission {
          env.ENV == "dev"
        }
      }

      steps {
        script {
          gv.dev()
        }
      }

      
    }

    stage("staging"){
      when {
        experission {
          env.ENV == "staging"
        }
      }

      steps{
        script {
          gv.staging()
        }
      }
    }

    stage("prod"){
      when {
        experission {
          env.ENV == "prod"
        }
      }

      steps{
        script {
          gv.prod()
        }
      }
    }
  }
}