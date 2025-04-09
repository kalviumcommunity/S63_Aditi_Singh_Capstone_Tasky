const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    res.send('Hello');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
