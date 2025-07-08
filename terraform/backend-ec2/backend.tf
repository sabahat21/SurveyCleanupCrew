terraform {
  cloud {
    organization = "sanskrit-survey-site"

    workspaces {
      name = "backend-ec2"
    }
  }
}

