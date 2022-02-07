def gv

pipeline {
  agent any 

  stages{

    stage("init"){
      steps {
        step {
          script {
            gv = load "scripts.groovy"
          }
        }
      }
    }

    stage("build"){
      steps {
        echo "building"
      }

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
          ENV == "dev"
        }
      }

      scripts {
        gv.dev()
      }
    }

    stage("staging"){
      when {
        experission {
          ENV == "staging"
        }
      }

      scripts {
        gv.staging()
      }
    }

    stage("prod"){
      when {
        experission {
          ENV == "prod"
        }
      }

      gv.prod()
    }
  }
}