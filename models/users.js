'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // 1. Users 모델에서
      this.hasMany(models.Products, {
        sourceKey: 'id', // 3. Users 모델의 userId 컬럼을
        foreignKey: 'userId' // 4. Products 모델의 UserId 컬럼과 연결합니다.
      });
    }
  }
  Users.init({
    id: DataTypes.INTEGER,// 이거 사실 안 넣어도 되는 거 같음
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};