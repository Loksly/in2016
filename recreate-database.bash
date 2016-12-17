#!/bin/bash

database=test

IP=`sudo docker inspect some-mysql | grep IPAddress | top -n 1 | cut -f 4 -d "\"" ` # use the ouput of this command on the next command as $IP variable
echo "The IP assigned to the container is: $IP"
echo "drop database $database" | mysql -u root -h $IP -proot 
echo "create database $database" | mysql -u root -h $IP -proot 

mysql -h $IP -u root --default-character-set=utf8 -proot $database < output/create.sql
mysql -h $IP -u root --default-character-set=utf8 -proot $database < output/alter.sql
gunzip < output/insert.sql.gz | mysql -h $IP -u root --default-character-set=utf8 -proot $database