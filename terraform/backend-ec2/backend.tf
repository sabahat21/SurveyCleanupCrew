terraform {
  backend "s3" {
    bucket         = "my-terraform-state-404-backend"
    key            = "backend-ec2/terraform.tfstate"
    region         = "us-east-1"
  }
}
