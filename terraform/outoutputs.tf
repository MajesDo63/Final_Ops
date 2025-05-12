output "web_server_public_ips" {
  description = "IPs públicas de los servidores web"
  value       = aws_instance.web_server[*].public_ip
}

output "web_server_private_ips" {
  description = "IPs privadas de los servidores web"
  value       = aws_instance.web_server[*].private_ip
}

output "bastion_public_ip" {
  description = "IP pública del bastión"
  value       = aws_instance.bastion.public_ip
}

output  "app_server_private_ips" {
  description = "IPs privadas de los servidores de aplicación"
  value       = aws_instance.app_server[*].private_ip
}