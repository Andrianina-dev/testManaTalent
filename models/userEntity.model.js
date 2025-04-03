const { getPool } = require('../config/db');

module.exports = {
  createUserEntity: async ({ user_id, entity_id }) => {
    const pool = getPool();
    try {
      const [result] = await pool.execute(
        'INSERT INTO userEntity (user_id, entity_id) VALUES (?, ?)',
        [user_id, entity_id]
      );

      const [data] = await pool.execute(
        'SELECT * FROM userEntity WHERE id = ?',
        [result.insertId]
      );

      return data[0];
    } catch (error) {
      console.error('Error in createUserEntity:', error);
      throw error;
    }
  },

  getAllUserEntities: async () => {
    const pool = getPool();
    try {
      const [rows] = await pool.execute('SELECT * FROM userEntity');
      return rows;
    } catch (error) {
      console.error('Error in getAllUserEntities:', error);
      throw error;
    }
  },

  getUserEntityById: async (id) => {
    const pool = getPool();
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM userEntity WHERE id = ?', 
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error in getUserEntityById:', error);
      throw error;
    }
  },

  // Méthode manquante pour vérifier l'existence d'une association
  checkUserEntityExists: async (id) => {
    const pool = getPool();
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM userEntity WHERE id = ? LIMIT 1',
        [id]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('Error in checkUserEntityExists:', error);
      throw error;
    }
  },

  updateUserEntity: async (id, updateFields) => {
    const pool = getPool();
    try {
      const filteredFields = {};
      for (const [key, value] of Object.entries(updateFields)) {
        if (value !== undefined && value !== null) {
          filteredFields[key] = value;
        }
      }

      if (Object.keys(filteredFields).length === 0) {
        throw new Error('No valid fields to update');
      }

      const setClause = Object.keys(filteredFields)
        .map(key => `${key} = ?`)
        .join(', ');
      const values = [...Object.values(filteredFields), id];

      const [result] = await pool.execute(
        `UPDATE userEntity SET ${setClause} WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        throw new Error('No userEntity found with this ID');
      }

      const [updated] = await pool.execute(
        'SELECT * FROM userEntity WHERE id = ?', 
        [id]
      );
      
      return updated[0] || null;
    } catch (error) {
      console.error('Error in updateUserEntity:', error);
      throw error;
    }
  },

  deleteUserEntity: async (id) => {
    const pool = getPool();
    try {
      const [userEntity] = await pool.execute(
        'SELECT id FROM userEntity WHERE id = ? LIMIT 1', 
        [id]
      );
      if (userEntity.length === 0) {
        throw new Error('UserEntity not found');
      }

      const [result] = await pool.execute(
        'DELETE FROM userEntity WHERE id = ?', 
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Failed to delete userEntity');
      }

      return { success: true, deletedId: id };
    } catch (error) {
      console.error('Error in deleteUserEntity:', error);
      throw error;
    }
  },

  checkUserEntityExistsByPair: async (user_id, entity_id) => {
    const pool = getPool();
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM userEntity WHERE user_id = ? AND entity_id = ? LIMIT 1',
        [user_id, entity_id]
      );
      return rows.length > 0;
    } catch (error) {
      console.error('Error in checkUserEntityExistsByPair:', error);
      throw error;
    }
  }
};