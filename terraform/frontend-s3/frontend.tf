terraform {
  backend "s3" {
    bucket = "my-terraform-state-404-backend"
    key    = "frontend-s3/terraform.tfstate"
    region = "us-east-1"
  }
}
