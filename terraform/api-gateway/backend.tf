terraform {
  backend "s3" {
    bucket = "my-terraform-state-404-backend"
    key    = "api-gateway/terraform.tfstate"
    region = "us-east-1"
  }
}
