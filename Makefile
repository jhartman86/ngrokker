SHELL = /bin/bash
MAKEFLAGS += --no-print-directory --silent
export COMPOSE_PROJECT_NAME = ngrokker

all:

start:
	docker-compose -f docker-compose.yml up -d
	docker-compose -f docker-compose.yml logs -f; true && make stop

stop:
	docker-compose -f docker-compose.yml down

ssh:
	docker-compose -f docker-compose.yml run --service-ports --rm ngrok /bin/sh