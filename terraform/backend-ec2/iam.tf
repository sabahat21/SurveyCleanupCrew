# terraform/backend-ec2/iam.tf
resource "aws_iam_role" "ec2_asr_role" {
  name = "ec2-asr-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "ec2.amazonaws.com" },
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_policy" "asr_s3_read" {
  name        = "asr-s3-read"
  description = "Allow EC2 to read sanskrit.nemo from S3"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid      = "AllowListBucket",
        Effect   = "Allow",
        Action   = ["s3:ListBucket"],
        Resource = "arn:aws:s3:::${var.model_bucket}"
      },
      {
        Sid      = "AllowGetObject",
        Effect   = "Allow",
        Action   = ["s3:GetObject"],
        Resource = "arn:aws:s3:::${var.model_bucket}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_asr_s3_read" {
  role       = aws_iam_role.ec2_asr_role.name
  policy_arn = aws_iam_policy.asr_s3_read.arn
}

resource "aws_iam_instance_profile" "ec2_asr_profile" {
  name = "ec2-asr-instance-profile"
  role = aws_iam_role.ec2_asr_role.name
}
