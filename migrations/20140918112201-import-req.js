var _ = require('lodash');
var Sequelize = require('sequelize');
var Promise = Sequelize.Promise;
var CSV = require('comma-separated-values');
var fs = require('fs');
Promise.promisifyAll(fs);

module.exports = {
  up: function(migration, DataTypes, done) {
    var sequelize = migration.migrator.sequelize;
    // add altering commands here, calling 'done' when finished
    var Opportunity = sequelize.model('opportunity');
    var User = sequelize.model('user');
    var Req = sequelize.model('requirement');
    var defaultCreator;
    User.find({ where: { email: 'clara@codeforamerica.org' } }).then(function(user) {
      // Set user.
      defaultCreator = user;
      return fs.readFileAsync(__dirname + '/../data_import/reqs.csv', { encoding: 'utf8' });
    }).then(function(data) {
      var parsedData = new CSV(data, {
        header: ['name','reqProvider', 'link', 'cost']
      }).parse();
      parsedData = _.map(parsedData, function(reqData) {
        return _.extend(reqData, { creatorId: defaultCreator.id });
      });
      var reqPromises = [];
      _.each(parsedData, function(reqData, index) {
        reqPromises.push(Req.create(reqData));
      });
      return Promise.all(reqPromises);
    }).success(function() {
      console.log('REQ DONE');
      return done();
    }).error(function(err) {
      return done(err)
    });

  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done()
  }
}
