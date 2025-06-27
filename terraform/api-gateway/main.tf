# terraform/api-gateway/main.tf

provider "aws" {
  region = "us-east-1"
}

variable "ec2_public_ip" {
  description = "The public IP of the EC2 instance to connect API Gateway to"
  type        = string
}

resource "aws_apigatewayv2_api" "this" {
  name          = "ec2-backend-api"
  protocol_type = "HTTP"
}

# Integration with EC2 backend
resource "aws_apigatewayv2_integration" "this" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "ANY"
  integration_uri        = "http://${var.ec2_public_ip}:8000"
  payload_format_version = "1.0"
}

# Route for /api/v1/survey/*
resource "aws_apigatewayv2_route" "survey" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /api/v1/survey/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.this.id}"
  api_key_required  = true
}

# Route for /api/v1/admin/*
resource "aws_apigatewayv2_route" "admin" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /api/v1/admin/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.this.id}"
  api_key_required  = true
}

# Stage
resource "aws_apigatewayv2_stage" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true
}

# Output the invoke URL
output "api_gateway_url" {
  description = "Public URL for API Gateway"
  value       = aws_apigatewayv2_stage.this.invoke_url
}
