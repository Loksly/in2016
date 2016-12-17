#!/bin/bash

sudo apt-get install -y docker.io
sudo service docker start
sudo docker pull mysql
sudo docker run --name some-mysql -p=3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql:latest