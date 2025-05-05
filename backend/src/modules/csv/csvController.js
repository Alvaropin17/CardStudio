const express = require('express');
const answer = require('../../red/answers');

const { verifyToken, checkUserPermission } = require('../auth/authService');
const userService = require('../users/userService');
const csvService = require('./csvService');

const router = express.Router({ mergeParams: true });

router.get('/',  getAllDatasets);
router.get('/:id', verifyToken, checkUserPermission, getDatasetById);
router.post('/', verifyToken, checkUserPermission, createDataset);
router.delete('/:id', verifyToken, checkUserPermission, deleteDataset);

// GET /users/:userId/datasets
async function getAllDatasets(req, res) {
  const userId = req.params.userId;
  try {
    const datasets = await csvService.getAllDatasetsByUser(userId);
    return answer.success(req, res, datasets, 200);
  } catch (error) {
    return answer.error(req, res, "Error getting datasets", 500);
  }
}

// GET /users/:userId/datasets/:id
async function getDatasetById(req, res) {
  const userId = req.params.userId;
  const id = req.params.id;

  try {
    const dataset = await csvService.getDatasetById(id, userId);
    if (!dataset) {
      return answer.error(req, res, "Dataset not found", 404);
    }
    return answer.success(req, res, dataset, 200);
  } catch (error) {
    return answer.error(req, res, "Error getting dataset", 500);
  }
}

// POST /users/:userId/datasets
async function createDataset(req, res) {
  const body = req.body;
  const username = body.username;

  if (!username || !body.name || !body.headers || !body.data_rows) {
    return answer.error(req, res, "Missing required fields", 400);
  }

  const user = await userService.getUserByName(username);
  if (!user) {
    return answer.error(req, res, "User not found", 404);
  }

  try {
    const dataset = await csvService.createDataset(body, user.id);
    return answer.success(req, res, dataset, 201);
  } catch (error) {
    return answer.error(req, res, "Error creating dataset", 500);
  }
}

// DELETE /users/:userId/datasets/:id
async function deleteDataset(req, res) {
  const userId = req.params.userId;
  const id = req.params.id;

  try {
    const deleted = await csvService.deleteDataset(id, userId);
    if (!deleted) {
      return answer.error(req, res, "Dataset not found", 404);
    }
    return answer.success(req, res, deleted, 200);
  } catch (error) {
    return answer.error(req, res, "Error deleting dataset", 500);
  }
}

module.exports = router;
