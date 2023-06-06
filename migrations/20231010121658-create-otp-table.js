'use strict';

const { Table, Column, Model, DataType, ForeignKey } = require("sequelize-typescript");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('otps', {
      id: {
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataType.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      phoneNumber: {
        type: DataType.STRING(14),
        allowNull: false,
        unique: true,
      },
      otpCode: {
        type: DataType.STRING(6),
        allowNull: false,
      },
      expires_at: {
        type: DataType.DATE,
        defaultValue: new Date(Date.now() + 3600 * 1000), // expires after 3600 seconds
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('otps');
  }
};
