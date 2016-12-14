(function(process, logger){
	'use strict';

	const path = require('path'),
		fs = require('fs'),
		zlib = require('zlib');

	let configFile, config, outputdir;

	function generateFieldDefinition(field){
		return '`' + field.name + '` ' + field.type + (field.null ? ' NULL' : ' NOT NULL') + (field.extra ? ' ' + field.extra : '');
	}

	function generateFieldsDefinition(config){
		return config.fields.map(generateFieldDefinition).join(",\n");
	}

	function generateKeyDefinition(config){
		return config.primarykeys.length > 0 ? (', PRIMARY KEY  (`' + config.primarykeys.join('`,`') + '`)') : '';
	}

	function generateCreateTable(config){
		return 'CREATE TABLE IF NOT EXISTS `' + config.tablename + "` (\n" + generateFieldsDefinition(config) + generateKeyDefinition(config) + ');';
	}

	function getPartitionInfo(config){
		return 'PARTITION BY ' + config.partition.type + ' (' + config.partition.fields.join(',') +') ' + config.partition.extraparameters;
	}

	function generateAlterTable(config){
		return 'ALTER TABLE `' + config.tablename + "` " + getPartitionInfo(config) + ';';
	}

	function createDDLFiles(config, directory){
		if (typeof config.ddlfiles === 'object'){
			let createFilename = path.join(directory, config.ddlfiles.create);
			let alterFilename = path.join(directory, config.ddlfiles.alter);
			fs.writeFileSync(createFilename, generateCreateTable(config), 'utf8');
			fs.writeFileSync(alterFilename, generateAlterTable(config), 'utf8');
		}
	}

	function createDMLFiles(config, directory){
		
		let insertFilename = path.join(directory, config.dmlfiles.insert);
		let stream = fs.createWriteStream(insertFilename, {flags: 'w'});
		let remainingtimes = parseInt(config.inserts);

		const gzip = zlib.createGzip();
		gzip.pipe(stream);

		if (!remainingtimes || remainingtimes <= 0){
			return;
		}
		let fields = config.fields.filter(function(f){ return config.primarykeys.indexOf(f.name) < 0; });
		let sqlprefix = 'insert into `' + config.tablename + '` (`' + fields.map(function(f){ return f.name; }).join("`, `") + '`) values (';
		while (remainingtimes > 0){
			gzip.write( createRandomRow(config, sqlprefix, fields) + ");\n");
			remainingtimes--;
		}
		gzip.end();
	}

	function generateSelect(config, count){
		return 'select ' + (count ? 'count(*)' : '*') + ' from `' + config.tablename + '`;';
	}

	function generateWhere(field){
		if (field.type === 'INT'){
			let min = (typeof field.min === 'number') ? field.min : -Number.MAX_SAFE_INTEGER;
			let max = (typeof field.max === 'number') ? field.min : Number.MAX_SAFE_INTEGER;
			return field.name + '=' + randomIntInc(min, max);
		}
		return '';
	}

	function generateSelectWhere(config, count){
		let fields = config.fields.filter(function(f){ return config.partition.fields.indexOf(f.name) >= 0; });
		return 'select ' + (count ? 'count(*)' : '*') + ' from `' + config.tablename + '` where ' + fields.map(generateWhere).join(' and ') + ';';
	}
	function generateQueries(config){
		return generateSelect(config, true) + "\n" + generateSelectWhere(config, true) + "\n" + generateSelect(config, false) + "\n" + generateSelectWhere(config, false) + "\n";
	}

	function createDQLFiles(config, directory){
		let queryFilename = path.join(directory, config.dqlfiles.query);
		fs.writeFileSync(queryFilename, generateQueries(config), 'utf8');
	}

	function recreateFolder(foldername, cb){
		fs.stat(foldername, function(err, stat){
			if (err){
				fs.mkdir(foldername, cb);
			}else{
				if ( stat.isDirectory() ){
					cb(null);
				} else {
					cb('The directory parameter must not exist or be a directory (not a file).');
				}
			}
		});
	}

	function randomIntInc (low, high) {
		return Math.floor(Math.random() * (high - low + 1) + low);
	}

	function createRandomRow(config, sqlprefix, fields){
		return sqlprefix + fields.map(function(field){
			if (field.type === 'FLOAT'){
				return Math.random();
			} else if (field.type === 'INT'){
				let min = (typeof field.min === 'number') ? field.min : -Number.MAX_SAFE_INTEGER;
				let max = (typeof field.max === 'number') ? field.min : Number.MAX_SAFE_INTEGER;

				return randomIntInc(min, max);
			} else if (field.type.toUpperCase().indexOf('CHAR') >= 0){
				return '\'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\'';
			}
			return '\'\'';
		}).join(', ');
	}


	if (process.argv.length < 4){
		logger.log('Usage: node index.js config.json outputdir');
		process.exit(0);
	}

	try {
		if (typeof process.argv[2] === 'string' && process.argv[2] !== ''){
			configFile = fs.readFileSync( path.join('.', process.argv[2]) );
		}
	
		config = JSON.parse(configFile);
		outputdir = process.argv[3];
		recreateFolder(outputdir, function(err){
			if (err){
				logger.error(err);
			} else {
				createDDLFiles(config, outputdir);
				createDMLFiles(config, outputdir);
				createDQLFiles(config, outputdir);
			}
		});

	} catch(e) {
		logger.error('Config file must exist and should be json valid');
		logger.error(e);
	}

})(process, console);
