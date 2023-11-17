'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // 1. 프로덕츠 모델에서
      this.belongsTo(models.Users, {// 2. Users 모델에게 N:1 관계 설정을 함 하 어디서 봤는데 이거
        targetKey: 'id', // 3. Users 모델의 userId 컬럼을
        foreignKey: 'userId', // 4. Products 모델의 UserId 컬럼과 연결합니다
      });
    }
  }
  Products.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};