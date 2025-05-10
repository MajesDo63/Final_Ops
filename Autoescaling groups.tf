# Launch Template para los servidores Web
resource "aws_launch_template" "web_lt" {
  name_prefix   = "web-lt-"
  image_id      = "ami-0f403e3180720dd7e"  # Amazon Linux 2023 (us-east-1)
  instance_type = "t2.micro"
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups = [aws_security_group.web_sg.id]
  }

  user_data = base64encode(<<EOF
#!/bin/bash
dnf update -y
dnf install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Web Server desde Auto Scaling Group (Amazon Linux 2023)</h1>" > /var/www/html/index.html
EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "ASG-Web-Instance"
    }
  }
}

# Auto Scaling Group para los servidores Web
resource "aws_autoscaling_group" "web_asg" {
  name                      = "web-asg"
  min_size                  = 1
  max_size                  = 2
  desired_capacity          = 1
  vpc_zone_identifier       = [aws_subnet.public[0].id, aws_subnet.public[1].id]
  health_check_type         = "EC2"
  health_check_grace_period = 30

  launch_template {
    id      = aws_launch_template.web_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "Web-ASG-Instance"
    propagate_at_launch = true
  }
}

# Launch Template para los servidores App (en subred privada)
resource "aws_launch_template" "app_lt" {
  name_prefix   = "app-lt-"
  image_id      = "ami-0f403e3180720dd7e"  # Amazon Linux 2023
  instance_type = "t2.micro"
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups = [aws_security_group.app_sg.id]
  }

  user_data = base64encode(<<EOF
#!/bin/bash
dnf update -y
dnf install -y java-17-amazon-corretto
echo "App server listo" > /home/ec2-user/app.txt
EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "ASG-App-Instance"
    }
  }
}

# Auto Scaling Group para los servidores App
resource "aws_autoscaling_group" "app_asg" {
  name                      = "app-asg"
  max_size                  = 2
  min_size                  = 1
  desired_capacity          = 1
  vpc_zone_identifier       = [aws_subnet.private_app[0].id, aws_subnet.private_app[1].id]
  health_check_type         = "EC2"
  health_check_grace_period = 30

  launch_template {
    id      = aws_launch_template.app_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "App-ASG-Instance"
    propagate_at_launch = true
  }
}
