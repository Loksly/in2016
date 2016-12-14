
## Get ready for the test

### Deploy using Docker

Run the last mysql version available:

```bash
$ sudo apt-get install -y docker.io
$ sudo service docker start
$ sudo docker pull mysql
$ sudo docker run --name some-mysql -p=3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql:latest
```

### Test and create the _test_ database

By unkown reasons in my tests the port is not right exported,
then we must get the IP Address of the docker and assign it to _IP_ bash variable.

```bash
$ docker inspect some-mysql | grep IPAddress # use the ouput of this command on the next command as $IP variable
$ echo 'create database test' | mysql -h $IP -proot 
```

### Test the partition plugin is available

First ensure the partition plugin is active:

```mysql
mysql> SHOW PLUGINS;
```

output should show something like:

```text
partition | ACTIVE | STORAGE ENGINE | NULL | GPL
```

If the partition plugin is not present or is not active then you must recompile the code using *-DWITH_PARTITION_STORAGE_ENGINE* option when compiling.

[Source](http://www.w3resource.com/mysql/mysql-partition.php)


### Stopping the container and releasing memory

```bash
$ docker stop some-mysql
$ docker rm some-mysql
```
