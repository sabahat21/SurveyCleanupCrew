provider "aws" {
  region = "us-east-1"
}

variable "ec2_public_ip" {
  description = "The public IP of the EC2 instance to connect API Gateway to"
  type        = string
}

# ------------------ HTTP API + CORS (ADD CORS HERE) ------------------
resource "aws_apigatewayv2_api" "this" {
  name          = "ec2-backend-api"
  protocol_type = "HTTP"

  # CORS for browser requests
  cors_configuration {
    # For testing you can keep "*". For production, set your CloudFront domain instead.
    allow_origins = ["*"]
    allow_methods = ["OPTIONS", "POST", "GET", "PUT", "DELETE", "PATCH"]
    allow_headers = ["content-type", "x-api-key", "authorization"]
    max_age       = 3600
    # allow_credentials = true  # uncomment if you use cookies/credentials
  }
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
  integration_uri        = "http://${var.ec2_public_ip}:5000/{proxy}"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_integration" "test_connection_integration" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "GET"
  integration_uri        = "http://${var.ec2_public_ip}:5000/api/test-connection"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_integration" "health_integration" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "GET"
  integration_uri        = "http://${var.ec2_public_ip}:5000/api/health"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_integration" "get_questions_integration" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "GET"
  integration_uri        = "http://${var.ec2_public_ip}:5000/api/get-questions"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_integration" "process_ranking_integration" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "POST"
  integration_uri        = "http://${var.ec2_public_ip}:5000/api/process-ranking"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_integration" "post_final_answers_integration" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "POST"
  integration_uri        = "http://${var.ec2_public_ip}:5000/api/post-final-answers"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_integration" "logs_integration" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "GET"
  integration_uri        = "http://${var.ec2_public_ip}:5000/api/logs"
  payload_format_version = "1.0"
}

# Integration: proxy to backend Express route
resource "aws_apigatewayv2_integration" "asr_transcribe" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "HTTP_PROXY"
  integration_method     = "POST"
  integration_uri        = "http://${var.ec2_public_ip}:8000/api/v1/audio/transcribe"
  payload_format_version = "1.0"         
  timeout_milliseconds   = 30000
}

# Mock integration for CORS preflight (OPTIONS)
resource "aws_apigatewayv2_integration" "mock_cors_audio_transcribe" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "MOCK"
  integration_method     = "OPTIONS"
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

resource "aws_apigatewayv2_route" "test_connection_route" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "GET /api/test-connection"
  target    = "integrations/${aws_apigatewayv2_integration.test_connection_integration.id}"
}

resource "aws_apigatewayv2_route" "health_route" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "GET /api/health"
  target    = "integrations/${aws_apigatewayv2_integration.health_integration.id}"
}

resource "aws_apigatewayv2_route" "get_questions_route" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "GET /api/get-questions"
  target    = "integrations/${aws_apigatewayv2_integration.get_questions_integration.id}"
}

resource "aws_apigatewayv2_route" "process_ranking_route" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "POST /api/process-ranking"
  target    = "integrations/${aws_apigatewayv2_integration.process_ranking_integration.id}"
}

resource "aws_apigatewayv2_route" "post_final_answers_route" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "POST /api/post-final-answers"
  target    = "integrations/${aws_apigatewayv2_integration.post_final_answers_integration.id}"
}

resource "aws_apigatewayv2_route" "logs_route" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "GET /api/logs"
  target    = "integrations/${aws_apigatewayv2_integration.logs_integration.id}"
}

# Route that matches what the frontend calls
resource "aws_apigatewayv2_route" "asr_transcribe_route" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "POST /api/v1/audio/transcribe"
  target    = "integrations/${aws_apigatewayv2_integration.asr_transcribe.id}"
}

# Route to handle OPTIONS /api/v1/audio/transcribe
resource "aws_apigatewayv2_route" "asr_transcribe_options_route" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "OPTIONS /api/v1/audio/transcribe"
  target    = "integrations/${aws_apigatewayv2_integration.mock_cors_audio_transcribe.id}"
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
