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

# ───────────── Integrations ─────────────

# Integration for /survey
resource "aws_apigatewayv2_integration" "survey_integration" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "ANY"
  integration_uri        = "http://${var.ec2_public_ip}:8000/api/v1/survey/{proxy}"
  payload_format_version = "1.0"
}

# Integration for /admin
resource "aws_apigatewayv2_integration" "admin_integration" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "ANY"
  integration_uri        = "http://${var.ec2_public_ip}:8000/api/v1/admin/{proxy}"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_integration" "ranking_integration" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "ANY"
  integration_uri        = "http://${var.ec2_public_ip}:5000/api/{proxy}"
  payload_format_version = "1.0"
}

# ───────────── Routes ─────────────

resource "aws_apigatewayv2_route" "survey_route" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /api/v1/survey/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.survey_integration.id}"
}

resource "aws_apigatewayv2_route" "admin_route" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /api/v1/admin/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.admin_integration.id}"
}

# Route for rank
resource "aws_apigatewayv2_route" "ranking_route" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /api/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.ranking_integration.id}"
}
# ───────────── Stage ─────────────

resource "aws_apigatewayv2_stage" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true
}

# ───────────── Output ─────────────

output "api_gateway_url" {
  description = "Public URL for API Gateway"
  value       = aws_apigatewayv2_stage.this.invoke_url
}
