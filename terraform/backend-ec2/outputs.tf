output "ec2_public_ip" {
  description = "Public IP address of the backend EC2 instance"
  value       = aws_instance.backend_server.public_ip
}
