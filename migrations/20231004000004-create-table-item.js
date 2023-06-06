'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT 1
        FROM   pg_tables
        WHERE  schemaname = 'public'
        AND    tablename = 'items'
      );`
    );

    if (!tableExists[0][0].exists) {
      await queryInterface.createTable('items', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
  
        name: {
          type: Sequelize.STRING(150),
          allowNull: false,
          defaultValue: '',
        },
        description: {
          type: Sequelize.STRING(255),
          defaultValue: '',
        },
        number_of_reviews: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        average_rating: {
          type: Sequelize.DOUBLE,
          defaultValue: 0,
        },
        price: {
          type: Sequelize.DOUBLE,
          defaultValue: 0,
        },
        category_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'categories',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        fasting: {
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
    await queryInterface.dropTable('items');
  }
};