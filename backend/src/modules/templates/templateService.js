const templateRepository = require('../../database/templateRepository');
const Template = require('../../database/models/template');

async function getAllTemplatesByUser(userId) {
  return await templateRepository.getAllByUser(userId);
}

async function getTemplateById(id, userId) {
  return await templateRepository.getOne(id, userId);
}

async function createTemplate(body, userId) {
  const template = new Template(
    null,
    userId,
    body.name,
    body.csv_id ?? null,
    body.canvas_json
  );
  return await templateRepository.createTemplate(template);
}

async function updateTemplate(body, id, userId) {
  const existing = await templateRepository.getOne(id, userId);

  const updated = new Template(
    id,
    userId,
    body.name || existing.name,
    null,
    body.canvas_json || existing.canvas_json
  );

  return await templateRepository.updateTemplate(updated);
}

async function deleteTemplate(id, userId) {
  return await templateRepository.deleteTemplate(id, userId);
}

//------------------------------Custom Functions------------------------------//

async function assignCsvToTemplate(templateId, csvId) {
  console.log('Assigning CSV to template:', templateId, csvId);
  return await templateRepository.assignCsvToTemplate(templateId, csvId);
}

module.exports = {
  getAllTemplatesByUser,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  assignCsvToTemplate,
};
