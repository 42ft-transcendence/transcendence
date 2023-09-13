PROJECT_NAME := transcendence
COMPOSE_FILE := docker-compose.yml
ENV_FILE := .env

DEV_PROJECT_NAME := dev-$(PROJECT_NAME)
DEV_COMPOSE_FILE := docker-compose.dev.yml

.PHONY: all publish develop clean fclean re

all: develop

publish:
	@echo "\n\033[0;33m[Build publish environment]\033[0m"
	@export PWD=`pwd -P` && docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up --build

develop:
	@echo "\n\033[0;33m[Build develop environment]\033[0m"
	@export PWD=`pwd -P` && docker-compose -p $(DEV_PROJECT_NAME) -f $(DEV_COMPOSE_FILE) --env-file $(ENV_FILE) up --build

clean:
	@echo "\n\033[0;33m[clean all containers]\033[0m"
	@if [ -n "$$(docker container ls -aq)" ]; then \
		docker container rm -f $$(docker container ls -aq); \
	else \
		echo "No containers to clean."; \
	fi
	@echo "

fclean:
	@echo "\n\033[0;33m[clean all containers]\033[0m"
	@if [ -n "$$(docker container ls -aq)" ]; then \
		docker container rm -f $$(docker container ls -aq); \
	else \
		echo "No containers to clean."; \
	fi

	@echo "\n\033[0;33m[clean all images]\033[0m"
	@if [ -n "$$(docker image ls -q)" ]; then \
		docker image rm -f $$(docker image ls -q); \
	else \
		echo "No images to clean."; \
	fi

	@echo "\n\033[0;33m[clean all volumes]\033[0m"
	@if [ -n "$$(docker volume ls -q)" ]; then \
		docker volume rm $$(docker volume ls -q); \
	else \
		echo "No volumes to clean."; \
	fi

re:
	@make fclean
	@make all
