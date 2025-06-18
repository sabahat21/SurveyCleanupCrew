provider "aws" {
  region = "us-east-1"
}

# 1. Create S3 bucket for frontend
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "my-sanskrit-survey-frontend-bucket"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  tags = {
    Name = "SurveyFrontend"
  }
}

# 2. Bucket policy for public access (needed for static website hosting)
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "PublicReadGetObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
      }
    ]
  })
}

# 3. CloudFront distribution pointing to S3 website endpoint
resource "aws_cloudfront_distribution" "frontend_cdn" {
  origin {
    domain_name = aws_s3_bucket.frontend_bucket.website_endpoint
    origin_id   = "S3WebsiteOrigin"

    s3_origin_config {
      origin_access_identity = ""
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3WebsiteOrigin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name = "SurveyFrontendCDN"
  }
}

# 4. Outputs used by GitHub Actions workflow
output "s3_bucket_name" {
  value = aws_s3_bucket.frontend_bucket.id
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend_cdn.id
}
