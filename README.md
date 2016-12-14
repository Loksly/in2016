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

Sections:
* [MySQL horizontal partitioning](mysql_horizontal_partitioning.md)
	* What does it mean horizontal partitioning?
	* Why to break the table into partitions?
	* What kinds of partition are supported?
	* Restrictions
* [Syntax](syntax.md)
	* How to define partitions using _CREATE TABLE_
	* How to define partitions using _ALTER TABLE_
* [Get ready for the test](environment.md)
	* Deploy using Docker
	* Test and create the _test_ database
	* Test the partition plugin is available
	* Stopping the container and releasing memory
* [Generate random data](generator.md)
	* Deploy the code
	* Dependencies
	* Check nodejs is accesible
	* Check the config file
	* Run the code
* [Run the test](test.md)
	* Load the data
	* Check partition status
	* Benchmark
	* The results

