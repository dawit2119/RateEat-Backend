'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('updated_menu_images', 'user_id', {
      type: Sequelize.UUID,
      references: {
        model: 'users', // assuming the users table name is 'users'
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // or 'CASCADE' if you want to delete the image when the user is deleted
      allowNull: true, // set to false if you don't want this column to be nullable
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('updated_menu_images', 'user_id');
  }
};
