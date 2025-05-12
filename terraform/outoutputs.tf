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

output "db_endpoint" {
  description = "Endpoint de la base de datos"
  value       = aws_db_instance.app_db.endpoint
}

output "db_port" {
  description = "Puerto de la base de datos"
  value       = aws_db_instance.app_db.port
}
