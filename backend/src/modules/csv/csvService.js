const csvDatasetRepository = require('../../database/csvDatasetRepository');
const CsvDataSet = require('../../database/models/csvDataset');

async function getAllDatasetsByUser(userId) {
  return await csvDatasetRepository.getAllByUser(userId);
}

async function getDatasetById(id, userId) {
  return await csvDatasetRepository.getOne(id, userId);
}

async function createDataset(body, userId) {
  const dataset = new CsvDataSet(
    null,
    userId,
    body.name,
    body.headers || [],
    body.data_rows || []
  );
  return await csvDatasetRepository.createCsvDataset(dataset);
}

async function deleteDataset(id, userId) {
  return await csvDatasetRepository.deleteCsvDataset(id, userId);
}

module.exports = {
  getAllDatasetsByUser,
  getDatasetById,
  createDataset,
  deleteDataset
};
