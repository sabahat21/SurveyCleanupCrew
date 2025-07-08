provider "aws" {
  region = "us-east-1"
}

resource "aws_ecs_cluster" "survey_cluster" {
  name = "survey-ecs-cluster"
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.survey_cluster.name
}
