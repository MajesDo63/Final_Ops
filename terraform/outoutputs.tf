output "web_server_public_ip" {
  description = "107.22.72.193"
  value       = aws_instance.web_server.public_ip
}