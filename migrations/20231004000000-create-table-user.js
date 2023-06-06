'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      telegram_id: {
        type: Sequelize.STRING(50),
      },
      first_name: {
        type: Sequelize.STRING(50),
      },
      last_name: {
        type: Sequelize.STRING(50),
      },
      date_of_birth: {
        type: Sequelize.DATE,
      },
      email: {
        type: Sequelize.STRING(50),
        unique: true,
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(255),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};