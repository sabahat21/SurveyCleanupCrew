# terraform/api-gateway/main.tf

provider "aws" {
  region = "us-east-1"
}

resource "aws_apigatewayv2_api" "this" {
  name          = "ec2-backend-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "this" {
  api_id           = aws_apigatewayv2_api.this.id
  integration_type = "HTTP_PROXY"
  integration_method = "ANY"

  integration_uri = "http://${var.ec2_public_ip}:8000"
}

resource "aws_apigatewayv2_route" "this" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.this.id}"
}

resource "aws_apigatewayv2_stage" "this" {
  api_id = aws_apigatewayv2_api.this.id
  name   = "$default"
  auto_deploy = true
}

output "api_gateway_url" {
  description = "Public URL for API Gateway"
  value       = aws_apigatewayv2_stage.this.invoke_url
}
