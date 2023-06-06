'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT 1
        FROM   pg_tables
        WHERE  schemaname = 'public'
        AND    tablename = 'candidate_restaurant_locations'
      );`
    );

    if (!tableExists[0][0].exists) {
      await queryInterface.createTable('candidate_restaurant_locations', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        latitude: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        longitude: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING, // You can adjust the data type if needed
          allowNull: true,
        },
        candidate_restaurant_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'candidate_restaurants', // Adjust the table name if needed
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
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
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('candidate_restaurant_locations');
  }
};
