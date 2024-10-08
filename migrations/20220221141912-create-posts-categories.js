'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PostsCategories', {
      postId: {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: null,
        references: {
          model: "BlogPosts",
          key: "id",
        }
      },
      categoryId: {
        type: Sequelize.INTEGER,
        onUpdate: "CASCADE",
        onDelete: null,
        references: {
          model: "Categories",
          key: "id",
        }
      }
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('PostsCategories');
  }
};