const Log = require('../model/Log');

const logController = {
  showLogs: (req, res) => {
    res.render('userlog', { title: 'User Activity Logs' });
  },

  index: (req, res) => {
    const log = new Log();
    log.all((err, data) => {
      if (err) {
        console.error('Error fetching logs:', err);
        return res.status(500).send('Terjadi kesalahan saat mengambil data log.');
      }
      res.json(data);
    });
  }
};

module.exports = logController;