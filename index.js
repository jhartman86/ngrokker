const ngrok = require('ngrok');
const app = require('express')();
const bodyParser = require('body-parser');
const path = require('path');
const requireAll = require('require-all');
let server;

/**
 * Launch NGROK using local ngrok.yml.
 */
ngrok.connect({
  configPath: path.join(__dirname, `./ngrok.yml`)
});

/**
 * If NGROK hits an error, bail on this.
 */
ngrok.on('error', err => {
  console.error('NGROK ERROR:', err);
  ngrok.disconnect();
  ngrok.kill();
  server && server.close();
});

/**
 * Once NGROK is connected, print the URL for this running
 * instance.
 */
ngrok.on('connect', url => {
  console.log('NGROK TUNNEL:', url);
});

/**
 * This might look a little funny for initializing an Express app;
 * normally you'd bind routes via .get() and .post() before invoking
 * .listen() on the app - but theres no reason that needs to happen.
 * So here, we're creating the server first, *THEN* binding routes
 * after.
 */
server = app.listen(80, () => {
  console.log('Express listening on :80');
  // Bind body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:false}));
  // Require all route handlers
  (function(routes) {
    Object.keys(routes).forEach(key => {
      routes[key](app);
    });
  })(requireAll(path.join(__dirname, './routes')));
  // Bind a catch all
  app.get('/*', (req, res) => {
    res.send('CATCHALL ROUTE');
  });
});

/**
 * Since ngrok is exec'd as a system process, its easy to leave it
 * in a running state while this node script bails - then when we
 * try and restart, it'll have the :4040 debug port locked up. So
 * when we CTRL+C the PM2 runner, we can hook into the SIGINT event
 * and try to gracefully kill these things.
 */
process.on('SIGINT', () => {
  console.log('GRACEFULLY STOPPING...');
  Promise.all([
    new Promise((resolve, reject) => {
      if (server) {
        server.close(() => {
          console.log('EXPRESS STOPPED OK');
          resolve();
        });
        return;
      }
      resolve();
    }),
    new Promise((resolve, reject) => {
      ngrok.kill(() => {
        console.log('NGROK STOPPED OK');
        resolve();
      });
    })
  ])
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('GRACEFUL SHUTDOWN FUCKED UP WITH', err);
    process.exit(0);
  });
});