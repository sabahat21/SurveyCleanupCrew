terraform {
  cloud {
    organization = "sanskrit-survey-site"
    workspaces {
      name = "frontend-s3"
    }
  }
}
