'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'facebook_id', {
      type: Sequelize.STRING(50),
      allowNull: true, // Set to true if it's not a required field
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'facebook_id');
  }
};
