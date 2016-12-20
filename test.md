
## Load the data

First set IP bash variable by this:
```bash
$ IP=`sudo docker inspect some-mysql | grep IPAddress | head -n 1 | cut -f 4 -d "\"" ` # use the ouput of this command on the next command as $IP variable
```

Then recreate first the structure, then the partition format, then load the data.
```bash
$ mysql -h $IP -u root --default-character-set=utf8 -proot test < output/create.sql
$ mysql -h $IP -u root --default-character-set=utf8 -proot test < output/alter.sql
$ gunzip < output/insert.sql.gz | mysql -h $IP -u root --default-character-set=utf8 -proot test
```

Or you may use the [./recreate-database.bash](recreate-database.bash) script.


## Check partition status:

```mysql
SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'test';
```


## Benchmark

To test we just change the query value to 2003, located in [query file](output/query.sql):

```mysql
select count(*) from `test`;
select count(*) from `test` where year=2003;
select * from `test`;
select * from `test` where year=2003;
```



Simple way:
```bash
$ /usr/bin/time -a -o timequeries.log mysql -h $IP --default-character-set=utf8 -u root -proot test < output/query.sql >/dev/null 2>/dev/null
```

```bash
# Hard way: [source](https://www.digitalocean.com/community/tutorials/how-to-measure-mysql-query-performance-with-mysqlslap)
# mysqlslap --user=root --password --host=$IP  --concurrency=20 --number-of-queries=1000 --create-schema=mysqlslaps --query="output/query.sql" --delimiter=";" --verbose --iterations=2 --debug-info
# It doesn't work.
```
```mysql
DROP TABLE `test`;
```
Let's recreate the structure, without the partition format, then load the data.
```bash
$ mysql -h $IP -u root --default-character-set=utf8 -proot test < output/create.sql
$ gunzip < output/insert.sql.gz | mysql -h $IP -u root --default-character-set=utf8 -proot test
```

Volver a ejecutar sin particiones:

```bash
$ /usr/bin/time -a -o timequeries_without.log mysql -h $IP --default-character-set=utf8 -u root -proot test < output/query.sql >/dev/null 2>/dev/null
```


Or you may use the [./run-benchmark.bash](run-benchmark.bash) script.


Don't forget to turn off your container using the [./stop-container.bash](stop-container.bash) script.

## The results

Given this distribution:

```mysql
mysql> SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'test';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p2000          |       8928 |
| p2001          |       8984 |
| p2002          |       9056 |
| p2003          |       8760 |
| p2004          |       8896 |
| p2005          |       8960 |
| p2006          |       8736 |
| p2007          |       8917 |
| p2008          |       8976 |
| p2009          |       8792 |
+----------------+------------+
10 rows in set (0.00 sec)
```

Time elapsed for the queries was:

```text
2.17user 0.16system 0:03.53elapsed 66%CPU (0avgtext+0avgdata 191828maxresident)k
0inputs+0outputs (0major+51419minor)pagefaults 0swaps
```


And with no partition, as we can see using this command:

```mysql
mysql>  SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'test';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| NULL           |      89799 |
+----------------+------------+
1 row in set (0.00 sec)
```

```text
Time elapsed for the queries was:
2.29user 0.18system 0:03.80elapsed 65%CPU (0avgtext+0avgdata 191904maxresident)k
0inputs+0outputs (0major+51417minor)pagefaults 0swaps
```

Almost no difference.
I guess I should check for a more complex example.
I may also use the _partition_ hint, when executing queries.

