
### What does it mean horizontal partitioning?

When we are talking about databases, _horizontal partitioning_ is a technique that
distributes portions of individual tables using different logical volumes,
files or nodes according to some rules. 
_Horizontal partitioning_ is different to _vertical partitioning_ in the way it splits the data.
In _horizontal partitioning_ different rows can be stored on different volumes.
In _vertical partitioning_ different fields of the same row can be stored on different volumes.

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
when you use a expression based on one or more attributes and the number of buckets available.
For example,
```mysql
PARTITION BY HASH( YEAR(fieldname) )
	PARTITIONS 4;
```

* [KEY partitioning](https://dev.mysql.com/doc/refman/5.7/en/partitioning-key.html):
when you choose the attribute or attributes used for partitioning without a function.
```mysql
PARTITION BY KEY(fieldname)
	PARTITIONS 10;
```

### Restrictions

There are some restrictions when choosing an expression, check them
[here](https://dev.mysql.com/doc/refman/5.7/en/partitioning-limitations.html), and you may
also be interested in the ways it handles _NULL_ values, explained 
[here](https://dev.mysql.com/doc/refman/5.7/en/partitioning-handling-nulls.html).
