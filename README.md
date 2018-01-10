# NGROKker

Testing webhooks from 3rd party services (eg. github, bitbucket, etc) can be a PIA. [NGROK](https://ngrok.com/) makes it way easier - effectively giving you a way to tunnel public endpoints to a server on your local system. This project is a small bundle that makes working with NGROK, and building endpoints in a local server (via [ExpressJS](https://expressjs.com/)) quick and repeatable.

## Requirements

- Docker and Docker Compose (if you have Docker for Mac or Window, you're good)
- GNU Make

Why Docker? It makes setting up an environment with the correct version of Node really easy, and you don't have to install the Ngrok binary onto your host system. Its all isolated, and easily repeatable.

## Usage

- Copy `ngrok.sample.yml` to a file named `ngrok.yml`. Replace the sample value with your authtoken (this assumes you have an account).
- Run `make start`

### Adding Endpoints

Need to test a webhook for a new service? Copy `routes/_.sample.js` to a new file like `routes/mything.js` and edit accordingly. Mostly you'll probably just be `console.log()`ing the payloads - but if the webhook requires a certain response you can mimic that easily.

### Credits

The author of [NPM's NGROK module](https://github.com/bubenshchykov/ngrok) made this super easy.

