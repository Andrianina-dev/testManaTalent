const entityModel = require('../models/entity.model');
const { getPool } = require('../config/db');

exports.create = async (req, res) => {
  const { name, description, siret, keyLicence, website } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Le nom est requis' });
  }

  try {
    const entity = await entityModel.createEntity({ 
      name,
      description: description || null,
      siret: siret || null,
      keyLicence: keyLicence || null,
      website: website || null
    });
    
    res.status(201).json(entity);
  } catch (err) {
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Erreur lors de la création';
    
    res.status(500).json({ 
      error: 'Erreur création',
      details: errorMessage
    });
  }
};


exports.findAll = async (req, res) => {
  try {
    const entities = await entityModel.getAllEntities();
    res.json(entities);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erreur récupération', 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


exports.findById = async (req, res) => {
  try {
    const entity = await entityModel.getEntityById(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Entité non trouvée' });
    }
    res.json(entity);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erreur récupération', 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, description, siret, keyLicence, website } = req.body;

  try {
  
    const entityExists = await entityModel.checkEntityExists(id);
    if (!entityExists) {
      return res.status(404).json({ error: 'Entité non trouvée' });
    }

    const updateData = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(siret !== undefined && { siret }),
      ...(keyLicence !== undefined && { keyLicence }),
      ...(website !== undefined && { website })
    };
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Aucune donnée valide à mettre à jour' });
    }
    
    const updatedEntity = await entityModel.updateEntity(updateData, id);
    
    res.json(updatedEntity);

  } catch (err) {
    console.error('Erreur lors de la mise à jour:', err);
    const statusCode = err.message.includes('non trouvée') ? 404 : 500;
    res.status(statusCode).json({
      error: err.message || 'Erreur lors de la mise à jour',
      ...(process.env.NODE_ENV === 'development' && { details: err.stack })
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    const exists = await entityModel.checkEntityExists(id);
    if (!exists) {
      return res.status(404).json({ error: 'Entité non trouvée' });
    }

    await entityModel.deleteEntity(id);
    
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ 
      error: 'Erreur suppression', 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};