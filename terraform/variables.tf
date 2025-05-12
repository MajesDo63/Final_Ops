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

variable "private_db_subnets" {
  description = "List of private db subnet CIDRs"
  type        = list(string)
  default     = ["10.0.4.0/24", "10.0.5.0/24"]
}

variable "db_identifier" {
  description = "Identificador de instancias de base de datos"
  type        = string
  default     = "devops-basedata"
}

variable "db_username" {
  description = "Usuario maestro de la base de datos"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Contraseña maestra de la base de datos"
  type        = string
  sensitive   = true
  default     = "proyectodevops"
}

variable "db_engine" {
  description = "Motor de base de datos"
  type        = string
  default     = "mysql"
}

variable "db_engine_version" {
  description = "Versión del motor"
  type        = string
  default     = "8.0.41"
}

variable "db_instance_class" {
  description = "Clase de instancia RDS"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_allocated_storage" {
  description = "Tamaño en GiB de almacenamiento asignado"
  type        = number
  default     = 20
}

variable "db_storage_type" {
  description = "Tipo de almacenamiento RDS"
  type        = string
  default     = "gp2"
}

variable "db_port" {
  description = "Puerto de la base de datos"
  type        = number
  default     = 3306
}

variable "db_multi_az" {
  description = "Habilitar Multi-AZ"
  type        = bool
  default     = true
}

variable "db_skip_final_snapshot" {
  description = "Omitir snapshot final al destruir"
  type        = bool
  default     = true
}

variable "db_publicly_accessible" {
  description = "Determina si la BD es accesible públicamente"
  type        = bool
  default     = false
}

variable "backup_retention_period" {
  description = "Periodo de retención de backups (días)"
  type        = number
  default     = 7
}

variable "preferred_backup_window" {
  description = "Ventana de backup preferida"
  type        = string
  default     = "03:00-04:00"
}

variable "preferred_maintenance_window" {
  description = "Ventana de mantenimiento preferida"
  type        = string
  default     = "sun:04:00-sun:05:00"
}