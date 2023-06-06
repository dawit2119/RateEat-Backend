'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT 1
        FROM   pg_tables
        WHERE  schemaname = 'public'
        AND    tablename = 'restaurant_reviews'
      );`
    );

    if (!tableExists[0][0].exists) {
      await queryInterface.createTable('restaurant_reviews', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        restaurant_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'restaurants',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        rating: {
          type: Sequelize.DOUBLE,
          allowNull: false,
        },
        comment: {
          type: Sequelize.STRING(255),
        },
        up_vote: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        down_vote: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        visibility: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
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

  down:async (queryInterface ,Sequelize) => {  
     await queryInterface.dropTable('restaurant_reviews');
  }
};
