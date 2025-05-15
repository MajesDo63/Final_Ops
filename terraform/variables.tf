variable "aws_region" {
  description = "Región AWS donde desplegar todos los recursos"
  type        = string
  default     = "us-east-1"  # cámbiala si usas otra
}

variable "bastion_allowed_cidr" {
  description = "CIDR para acceso SSH al bastión"
  type        = string
  default     = "18.207.96.251/32"
}

variable "key_name" {
  description = "Nombre del key pair SSH"
  type        = string
  default     = "Proyecto"
}

variable "bastion_ami" {
  description = "AMI ID del bastión"
  type        = string
}

variable "bastion_instance_type" {
  description = "Tipo de instancia EC2 para el bastión"
  type        = string
  default     = "t3.micro"
}

variable "web_server_ami" {
  description = "AMI ID para los servidores web"
  type        = string
}

variable "web_server_instance_type" {
  description = "Tipo de instancia EC2 para los servidores web"
  type        = string
  default     = "t3.micro"
}

variable "web_server_count" {
  description = "Número de instancias web"
  type        = number
  default     = 2
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "List of public subnet CIDRs"
  type        = list(string)
  default     = ["10.0.0.0/24", "10.0.1.0/24"]
}

variable "private_app_subnets" {
  description = "List of private app subnet CIDRs"
  type        = list(string)
  default     = ["10.0.2.0/24", "10.0.3.0/24"]
}

variable "app_server_count" {
  description = "Número de instancias de aplicación"
  type        = number
  default     = 2
}

variable "app_server_ami" {
  description = "AMI ID para los servidores de aplicación"
  type        = string
  default     = "ami-0f403e3180720dd7e"
}

variable "app_server_instance_type" {
  description = "Tipo de instancia EC2 para los servidores de aplicación"
  type        = string
  default     = "t3.micro"
}
