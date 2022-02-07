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

          env.ENV = input message: "Select the environment" ok "Done" parameters: [choice(name: 'environment', choices: ["dev", "staging", "prod"], description: "Deploy build in selected environment" )]
        }
      }
    }

    stage("dev"){
      when {
        expression {
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
        expression {
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
        expression {
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