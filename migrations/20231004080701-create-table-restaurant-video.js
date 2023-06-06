'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
        SELECT 1
        FROM   pg_tables
        WHERE  schemaname = 'public'
        AND    tablename = 'restaurant_videos'
      );`
    );

    if (!tableExists[0][0].exists) {
      await queryInterface.createTable('restaurant_videos', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        url: {
          type: Sequelize.STRING(255),
          allowNull: false,
          defaultValue: '',
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
    await queryInterface.dropTable('restaurant_videos');
  }
};