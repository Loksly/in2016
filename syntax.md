
### How to define partitions using _CREATE TABLE_

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

### How to define partitions using _ALTER TABLE_

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
