const { readFile } = require('fs').promises;
const { taskStorage } = require('./task-storage');

const fetchDataOnStartup = async (filePath) => {
  const res = await readFile(filePath, 'utf-8');
  const data = JSON.parse(res);
  // const filteredData = data.tasks.filter(item => item.done !== true);
  // taskStorage.tasks = filteredData;
  Object.assign(taskStorage, data);

  console.log('Restored last session:');
  console.log(taskStorage);
};

module.exports = { fetchDataOnStartup };
