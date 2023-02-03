const { readFile } = require('fs').promises;

const fetchDataOnStartup = async (filePath, database) => {
  const res = await readFile(filePath, 'utf-8');
  try {
    const data = JSON.parse(res);
    Object.assign(database, data);

    console.log('Restored last session:');
    console.log(database);
  } catch (e) {
    console.error('Database is empty.', e.message);
  }
};

module.exports = { fetchDataOnStartup };
