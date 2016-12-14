# business intelligence 2016

This repository is just a toy. Don't use on production any of the code it has.

## P06-Partitions in DB and DWH: horizontal partition in mysql/mariadb

* Explain the different kind of horizontal partitioning available on mysql.
* Then benchmark a medium sized table with and without horizontal partitioning.
* Create a table for mysql that has 30 attributes distributed:
	* 15 fixed sized of 100 chars
	* 13 float or float
	* 1 int autoincrement key
	* 1 int named year


* Fill the table with:
	* 100 thousand rows.
	* Random data for the varchar attributes and decimal ones.
	* A sequence for the primary key.
	* 10 different values between 2000 and 2009 for the "year" attribute.

* Create the same table using the horizontal partitioning on the year attribute.
* Run the same benchmark for retriving some data that belong to 2003 on both schemas.
* Show the stats and analyze the results.

<hr />

# Let's go


### What does it mean horizontal partitioning?

When we are talking about databases, _horizontal partitioning_ is a technique that
distributes portions of individual tables using different logical volumes,
files or nodes according to some rules. 
_Horizontal partitioning_ is different to _vertical partitioning_ in the way it splits the data.
In _horizontal partitioning_ different rows can be stored on different files.
In _vertical partitioning_ different fields of the same row can be stored on different files.

Mysql partitioning is a kind of horizontal partitioning that breaks the data accross different files on the same logical server.
Note that breaking the data accross different nodes of the same cluster is a completely different concept named
[sharding](https://en.wikipedia.org/wiki/Shard_(database_architecture)).


### Why to break the table into partitions?

Performance. When you choose to partition the data accross different files what you are trying to gain is performance.
Each of the partition can behave or be storaged in [different filesystems](https://dev.mysql.com/doc/refman/5.7/en/symbolic-links.html),
follow different backup strategies for each file or have different subpartitions strategies so you may speedup some key queries.


### What kinds of partition are supported?


The mysql partition plugin supports four kind of horizontal partitions,
[source](https://dev.mysql.com/doc/refman/5.7/en/partitioning-types.html):

* [RANGE partitioning](https://dev.mysql.com/doc/refman/5.7/en/partitioning-range.html):
when the attribute or expression value used can be selected between two values.
For example:
```mysql
PARTITION BY RANGE (fieldname) (
	PARTITION p0 VALUES LESS THAN (100),
	PARTITION p1 VALUES LESS THAN (200),
	PARTITION p2 VALUES LESS THAN MAXVALUE
)
```

* [LIST partitioning](https://dev.mysql.com/doc/refman/5.7/en/partitioning-columns-list.html):
when the attribute value used belongs to a list of members.
For example,
```mysql
PARTITION BY LIST COLUMNS (fieldname) (
	PARTITION pRegion_1 VALUES IN('Oskarshamn', 'Högsby', 'Mönsterås'),
	PARTITION pRegion_2 VALUES IN('Vimmerby', 'Hultsfred', 'Västervik'),
	PARTITION pRegion_3 VALUES IN('Nässjö', 'Eksjö', 'Vetlanda')
)
```
* [HASH partitioning](https://dev.mysql.com/doc/refman/5.7/en/partitioning-hash.html):
when you use a expression based on one or more attributes of the row and the number of buckets.
For example,
```mysql
PARTITION BY HASH( YEAR(fieldname) )
	PARTITIONS 4;
```

* [KEY partitioning](https://dev.mysql.com/doc/refman/5.7/en/partitioning-key.html):
when you choose the attribute or attributes used for partitioning without a function but rely on mysql.
```mysql
PARTITION BY KEY(fieldname)
	PARTITIONS 10;
```

Check the restrictions when choosing an expression [here](https://dev.mysql.com/doc/refman/5.7/en/partitioning-limitations.html).


## Ways to define partitions

You may use this syntax to use partitions:

```mysql like
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name (create_definition,...) [table_options] [partition_options]

partition_options :

PARTITION BY
		{ [LINEAR] HASH(expr)
		| [LINEAR] KEY(column_list)
		| RANGE(expr)
		| LIST(expr) }
	[PARTITIONS num]
	[SUBPARTITION BY
		{ [LINEAR] HASH(expr)
		| [LINEAR] KEY(column_list) }
	  [SUBPARTITIONS num]
	]
	[(partition_definition [, partition_definition] ...)
partition_definition :

 PARTITION partition_name
		[VALUES 
			{LESS THAN {(expr) | MAXVALUE} 
			| 
			IN (value_list)}]
		[[STORAGE] ENGINE [=] engine_name]
		[COMMENT [=] 'comment_text' ]
		[DATA DIRECTORY [=] 'data_dir']
		[INDEX DIRECTORY [=] 'index_dir']
		[MAX_ROWS [=] max_number_of_rows]
		[MIN_ROWS [=] min_number_of_rows]
		[TABLESPACE [=] tablespace_name]
		[NODEGROUP [=] node_group_id]
		[(subpartition_definition [, subpartition_definition] ...)]
subpartition_definition :

		SUBPARTITION logical_name
		[[STORAGE] ENGINE [=] engine_name]
		[COMMENT [=] 'comment_text' ]
		[DATA DIRECTORY [=] 'data_dir']
		[INDEX DIRECTORY [=] 'index_dir']
		[MAX_ROWS [=] max_number_of_rows]
		[MIN_ROWS [=] min_number_of_rows]
		[TABLESPACE [=] tablespace_name]
		[NODEGROUP [=] node_group_id]
```			

You may also _alter_ an already existing table using _alter_ command. Check this example:

```mysql
	ALTER TABLE tablename
	PARTITION BY RANGE (year)
	(
		PARTITION p0 VALUES LESS THAN (2000),
		PARTITION p1 VALUES LESS THAN (2001),
		PARTITION p2 VALUES LESS THAN (2002),
		PARTITION p3 VALUES LESS THAN (2003),
		PARTITION p4 VALUES LESS THAN MAXVALUE
	);
```


## Test


First ensure the partition plugin is active:

```mysql
SHOW PLUGINS;
```

output should show something like:

```text
partition | ACTIVE | STORAGE ENGINE | NULL | GPL
```

If the partition plugin is not present or is not active then you must recompile the code using *-DWITH_PARTITION_STORAGE_ENGINE* option when compiling.

[Source](http://www.w3resource.com/mysql/mysql-partition.php)


MySQL 5.6 supports explicit partition selection for queries, so for example,

```mysql
SELECT * FROM test PARTITION (p2010, p2011) WHERE strfield = 'Lorem ipsum';
```
selects only those rows in partitions p2010 and p2011 that match the WHERE condition, this can greatly speed up queries.



Check partition status:

```mysql
SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'test';
```

## Running the code that creates the environment test



### Create the sql file with random data


### Deploy using Docker

Run the last mysql version available:

```bash
$ sudo apt-get install -y docker.io
$ sudo service docker start
$ sudo docker pull mysql
$ sudo docker run --name some-mysql -p=3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql:latest
```

By unkown reasons in my tests the port is not right exported, then we must get the IP Address of the docker
and assign it to _IP_ bash variable.

```bash
$ docker inspect some-mysql | grep IPAddress
$ echo 'create database test' | mysql -h $IP -proot 
$ mysql -h $IP --default-character-set=utf8 -proot test < data.example.sql

```

### Stopping the container and releasing memory

```bash
$ docker stop some-mysql
$ docker rm some-mysql
```
