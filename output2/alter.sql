ALTER TABLE `test` PARTITION BY RANGE (year) PARTITION p2000 VALUES LESS THAN (2001), PARTITION p2001 VALUES LESS THAN (2002), PARTITION p2002 VALUES LESS THAN (2003), PARTITION p2003 VALUES LESS THAN (2004), PARTITION p2004 VALUES LESS THAN (2005), PARTITION p2005 VALUES LESS THAN (2006), PARTITION p2006 VALUES LESS THAN (2007), PARTITION p2007 VALUES LESS THAN (2008), PARTITION p2008 VALUES LESS THAN (2009), PARTITION p2009 VALUES LESS THAN MAXVALUE;