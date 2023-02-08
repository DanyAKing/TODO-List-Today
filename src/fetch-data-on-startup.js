const { readFile } = require('fs').promises;
const { taskStorage } = require('./task-storage');

const fetchDataOnStartup = async (filePath) => {
  const res = await readFile(filePath, 'utf-8');
  const data = JSON.parse(res);
  Object.assign(taskStorage, data);

  console.log('Restored last session:');
  console.log(taskStorage);
};

module.exports = { fetchDataOnStartup };
