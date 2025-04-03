const userModel = require('../models/user.model');
const pool = require('../config/db');
const { initDB } = require('../config/db');

exports.create = async (req, res) => {
  const { name, firstName, email, password } = req.body;

  if (!name || !firstName || !email || !password) {
    return res.status(400).json({ error: 'username, email et password sont requis' });
  }

  try {
    const user = await userModel.createUser({ name, firstName, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur création', details: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    
await initDB();
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération', details: err.message });
  }
};

exports.findById = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération', details: err.message });
  }
};


exports.checkEmailExists = async (email, excludeId = null) => {
    const connection = await pool.getConnection();
  
    try {
      await initDB();
      let query = 'SELECT id FROM user WHERE email = ?';
      const params = [email];
  
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
  
      const [rows] = await connection.execute(query, params);
      return rows.length > 0;
    } finally {
      connection.release();
    }
  };
  
  exports.update = async (req, res) => {
    const { id } = req.params;
    const { name, firstName, email, password, language } = req.body;
  
    try {
      await initDB();
      
      // Make sure you're using the correct model name (userModel vs userEntityModel)
      const userExists = await userModel.checkUserExists(id);
      if (!userExists) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
  
      if (email && await userModel.checkEmailExists(email, id)) {
        return res.status(409).json({ error: 'Email déjà utilisé' });
      }
  
      const updateData = {
        ...(name !== undefined && { name }),
        ...(firstName !== undefined && { firstName }),
        ...(email !== undefined && { email }),
        ...(language !== undefined && { language }),
        ...(password && { password: await bcrypt.hash(password, 10) })
      };
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'Aucune donnée valide à mettre à jour' });
      }
      
      const updatedUser = await userModel.updateUser(updateData, id);
      
      return res.json(updatedUser);
  
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      const statusCode = err.message.includes('non trouvé') ? 404 : 500;
      res.status(statusCode).json({
        error: err.message || 'Erreur lors de la mise à jour',
        ...(process.env.NODE_ENV === 'development' && { details: err.stack })
      });
    }
  };

exports.remove = async (req, res) => {
  try {
    await initDB();
    const exists = await userModel.checkUserExists(req.params.id);
    if (!exists) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    await userModel.deleteUser(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression', details: err.message });
  }
};
