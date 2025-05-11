#Aqui definiremos las variables que utilizaremos y el vpc
# variables.tf
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "List of public subnet CIDRs"
  default     = ["10.0.0.0/24", "10.0.1.0/24"]
}

variable "private_app_subnets" {
  description = "List of private app subnet CIDRs"
  default     = ["10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_db_subnets" {
  description = "List of private db subnet CIDRs"
  default     = ["10.0.4.0/24", "10.0.5.0/24"]
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