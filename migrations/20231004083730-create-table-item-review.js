'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT 1
        FROM   pg_tables
        WHERE  schemaname = 'public'
        AND    tablename = 'item_reviews'
      );`
    );

    if (!tableExists[0][0].exists) {
      await queryInterface.createTable('item_reviews', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        item_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'items',
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
          defaultValue: 0,
        },
        comment: {
          type: Sequelize.STRING(255),
          defaultValue: '',
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
          defaultValue: false,
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
    await queryInterface.dropTable('item_reviews');
  }
};