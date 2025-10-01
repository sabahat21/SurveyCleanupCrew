provider "aws" {
  region = "us-east-1"
}

resource "aws_ecr_repository" "node_backend_repo" {
  name = "node_backend"
  image_scanning_configuration {
    scan_on_push = true
  }
  force_delete = true
}

resource "aws_ecr_repository" "flask_ranker_repo" {
  name = "flask-ranker"
  image_scanning_configuration {
    scan_on_push = true
  }
  force_delete = true
}

output "node_backend_repo_url" {
  value = aws_ecr_repository.node_backend_repo.repository_url
}

output "flask_ranker_repo_url" {
  value = aws_ecr_repository.flask_ranker_repo.repository_url
}
