var env = {
	webPort: process.env.PORT || 3010,
	dbPath: process.env.MONGO_PATH || 'localhost',
	dbUser: process.env.MONGO_USER || '',
	dbPassword: process.env.MONGO_PASS || '',
	dbDatabase: process.env.MONGO_DB || 'api_stage'
};

var dburl = process.env.NODE_ENV === 'production' ?
	'mongodb://' + env.dbUser + ';' + env.dbPassword + env.dbHost + env.dbDatabase  :
	'mongodb://localhost/' + env.dbDatabase;

module.exports = {
	env: env,
	dburl: dburl
};
