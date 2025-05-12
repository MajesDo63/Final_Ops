#Indicar que usaremos aws y la region en la que trabajaremos
# provider.tf
provider "aws" {
  profile = "default" 
  region = "us-east-1" 
}
