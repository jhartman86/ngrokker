module.exports = (app) => {
  app.post('/webhook-sample', (req, res) => {
    console.log(req.body);
    res.status(200).end();
  });
};
