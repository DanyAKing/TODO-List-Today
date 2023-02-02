const { readFile } = require('fs').promises;

const fetchDataOnStartup = async (filePath, database) => {
  const res = await readFile(filePath, 'utf-8');
  const data = JSON.parse(res);
  data.tasks.forEach(el => {
    database.tasks.push(el);
  });
  console.log(database);
};

module.exports = { fetchDataOnStartup };
