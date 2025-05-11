# Aquí va toda la infraestructura: VPC, subredes, instancias, etc

# Variables
# CIDR para acceso SSH al bastión (reemplaza por tu IP/32)
variable "bastion_allowed_cidr" {
  description = "CIDR para acceso SSH al bastión"
  type        = string
  default     = "TU.IP.PUBLICA/32"
}

data "aws_availability_zones" "available" {}

variable "vpc_cidr" {
  type = string
}

variable "public_subnets" {
  type = list(string)
}

variable "private_app_subnets" {
  type = list(string)
}

variable "private_db_subnets" {
  type = list(string)
}

variable "key_name" {
  description = "Nombre del key pair SSH"
  type        = string
  default     = "Proyecto"
}

# VPC principal
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
  }
}

# Subredes públicas
resource "aws_subnet" "public" {
  count                   = length(var.public_subnets)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-${count.index + 1}"
  }
}

# Subredes privadas de aplicación
resource "aws_subnet" "private_app" {
  count             = length(var.private_app_subnets)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_app_subnets[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "private-app-subnet-${count.index + 1}"
  }
}

# Subredes privadas de base de datos
resource "aws_subnet" "private_db" {
  count             = length(var.private_db_subnets)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_db_subnets[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "private-db-subnet-${count.index + 1}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main-igw"
  }
}

# Tabla de rutas pública
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "public-route-table"
  }
}

# Asociaciones de subred pública
resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Security Group para el frontend web (público)
resource "aws_security_group" "web_sg" {
  name        = "web-sg"
  description = "Allow HTTP, HTTPS and SSH"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "web-sg"
  }
}

# Security Group para el bastion host (jump box)
resource "aws_security_group" "bastion_sg" {
  name        = "bastion-sg"
  description = "Allow SSH only from specified CIDR"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH acceso desde CIDR definido"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.bastion_allowed_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bastion-sg"
  }
}

# Security Group para la capa de aplicación (privada)
resource "aws_security_group" "app_sg" {
  name        = "app-sg"
  description = "Allow traffic from web layer and bastion"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.web_sg.id]
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app-sg"
  }
}

# Security Group para la base de datos (privada)
resource "aws_security_group" "db_sg" {
  name        = "db-sg"
  description = "Allow traffic from app layer"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "db-sg"
  }
}

# EC2: Servidor web público (2 instancias)
resource "aws_instance" "web_server" {
  count                   = 2
  ami                     = "ami-0f403e3180720dd7e" # Amazon Linux 2023 (us-east-1)
  instance_type           = "t2.micro"
  subnet_id               = aws_subnet.public[count.index].id
  vpc_security_group_ids  = [aws_security_group.web_sg.id]
  key_name                = var.key_name

  tags = {
    Name = "Web-Server-${count.index + 1}"
  }
}

# EC2: Bastion host en subred pública (1 instancia)
resource "aws_instance" "bastion" {
  ami                     = "ami-0f403e3180720dd7e" # Amazon Linux 2023 (us-east-1)
  instance_type           = "t2.micro"
  subnet_id               = aws_subnet.public[0].id
  vpc_security_group_ids  = [aws_security_group.bastion_sg.id]
  key_name                = var.key_name

  tags = {
    Name = "Bastion-Host"
  }
}

# EC2: Servidor de aplicación privado (2 instancias)
resource "aws_instance" "app_server" {
  count                   = 2
  ami                     = "ami-0f403e3180720dd7e" # Amazon Linux 2023
  instance_type           = "t2.micro"
  subnet_id               = aws_subnet.private_app[count.index].id
  vpc_security_group_ids  = [aws_security_group.app_sg.id]
  key_name                = var.key_name

  tags = {
    Name = "App-Server-${count.index + 1}"
  }
}
