## Deploy the code

```bash
$ git clone "https://github.com/Loksly/in2016"
$ cd in2016
```

## Dependencies

The code that generates de random data for the test has been writing using nodejs latest version (v6.9.2),
although it may run ok on previous versions. It has no more dependencies than that.

### Check nodejs is accesible

```bash
$ node --version
v6.9.2
```

### Check the config file.

You may read and modify the _config.cfg_ file. Two examples are available on repository,
both with 30 fields and each one with different kinds of partitions.

### Run the code

```bash
$ node config outputdir
```

Then after that there should be some files on the output directory, (names may vary depending on the config file):
* _create.sql_: This file contains the SQL instruction that generates the table structure definition.
* _alter.sql_: This file contains the SQL instruction that activates the partition definition.
* _insert.sql.gz_: This compressed file contains the SQL of the testing data.
* _query.sql_: This is the small queries test we are going to benchmark.
