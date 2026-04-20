const { createTables } = require('./db');

const setup = async () => {
  try {
    await createTables();
    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  }
};

setup();