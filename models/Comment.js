module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
      id: DataTypes.STRING,
      content: DataTypes.STRING
  });

  return Comment
}

