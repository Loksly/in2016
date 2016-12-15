
## Load the data

First set IP bash variable by this:
```bash
$ IP=`sudo docker inspect some-mysql | grep IPAddress | cut -f 4 -d "\"" ` # use the ouput of this command on the next command as $IP variable
```

Then recreate first the structure, then the partition format, then the data.
```bash
$ mysql -h $IP -u root --default-character-set=utf8 -proot test < output/create.sql
$ mysql -h $IP -u root --default-character-set=utf8 -proot test < output/alter.sql
$ gunzip < output/insert.sql.gz | mysql -h $IP -u root --default-character-set=utf8 -proot test
```


## Check partition status:

```mysql
SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'test';
```


## Benchmark

Simple way:
```bash
$ time mysql -h $IP --default-character-set=utf8 -proot test < output/query.sql
```

Hard way: [source](https://www.digitalocean.com/community/tutorials/how-to-measure-mysql-query-performance-with-mysqlslap)
```bash
sudo mysqlslap --user=root --password --host=$IP  --concurrency=20 --number-of-queries=1000 --create-schema=employees --query="output/query.sql" --delimiter=";" --verbose --iterations=2 --debug-info
```


## The results
