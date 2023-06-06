'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT 1
        FROM   pg_tables
        WHERE  schemaname = 'public'
        AND    tablename = 'restaurants'
      );`
    );

    if (!tableExists[0][0].exists) {
      await queryInterface.createTable('restaurants', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(128),
          allowNull: false,
        },
        opening_hour: {
          type: Sequelize.TIME,
          defaultValue: '10:00:00',
        },
        closing_hour: {
          type: Sequelize.TIME,
          defaultValue: '22:00:00',
        },
        is_open: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        average_price: {
          type: Sequelize.DOUBLE,
          defaultValue: 0,
        },
        average_rating: {
          type: Sequelize.DOUBLE,
          defaultValue: 0,
        },
        number_of_reviews: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('restaurants');
  }
};
