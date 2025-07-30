provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "backend_sg" {
  name        = "backend_security_group"
  description = "Allow inbound access to backend"

  ingress {
    description = "Allow HTTP from anywhere"
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow Gradio UI access"
    from_port   = 7860
    to_port     = 7860
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow backend API access (port 8000)"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow SSH from my computer"
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow backend API access (port 5000)"
    from_port = 5000
    to_port = 5000
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "BackendSecurityGroup"
  }
}
 
resource "aws_instance" "backend_server" {
  ami           = "ami-0c101f26f147fa7fd"
  instance_type = "t2.micro"
  key_name      = "backend-keypair"
  vpc_security_group_ids = [aws_security_group.backend_sg.id]
  iam_instance_profile = aws_iam_instance_profile.ec2_asr_profile.name


  user_data = <<-EOF
              #!/bin/bash
              yum update -y || dnf -y update
              amazon-linux-extras install docker -y || yum install -y docker || dnf install -y docker
              service docker start || systemctl start docker
              usermod -a -G docker ec2-user
              # ensure aws cli exists for aws s3 cp during deploy
              yum install -y awscli || dnf install -y awscli
              EOF

  root_block_device {
    volume_size = 30          # Size in GB
    volume_type = "gp2"       # General purpose SSD 
    delete_on_termination = true
  }

  tags = {
    Name = "NodeBackendEC2"
  }
  
}

