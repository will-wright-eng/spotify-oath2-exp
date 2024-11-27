#* Variables
SHELL := /usr/bin/env bash

#* Setup
.PHONY: $(shell sed -n -e '/^$$/ { n ; /^[^ .\#][^ ]*:/ { s/:.*$$// ; p ; } ; }' $(MAKEFILE_LIST))
.DEFAULT_GOAL := help

help: ## list make commands
	@echo ${MAKEFILE_LIST}
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

#* Commands
docker-kill: ## kill all docker containers
	for id in $$(docker ps --format "{{.ID}}"); do docker kill $$id; done

up: ## start app with `docker-compose up --build`
	docker-compose up --build --remove-orphans

open: ## open http://0.0.0.0:8000/api/docs
	open http://0.0.0.0:8000/api/docs

#* Cleaning
pycache-remove: ## subset of 'cleanup'
	find . | grep -E "(__pycache__|\.pyc|\.pyo$$)" | xargs rm -rf

dsstore-remove: ## subset of 'cleanup'
	find . | grep -E ".DS_Store" | xargs rm -rf

mypycache-remove: ## subset of 'cleanup'
	find . | grep -E ".mypy_cache" | xargs rm -rf

ipynbcheckpoints-remove: ## subset of 'cleanup'
	find . | grep -E ".ipynb_checkpoints" | xargs rm -rf

pytestcache-remove: ## subset of 'cleanup'
	find . | grep -E ".pytest_cache" | xargs rm -rf

cleanup: pycache-remove dsstore-remove mypycache-remove ipynbcheckpoints-remove pytestcache-remove ## run all '-remove' commands
