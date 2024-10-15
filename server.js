const app = require('./app');
const { PORT = 9090 } = process.env

const server = app.listen(PORT, () => console.log(`listening on ${PORT}`))

module.exports = server;