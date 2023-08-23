PROJECT_NAME := Transcendence
COMPOSE_FILE := docker-compose.yml
ENV_FILE := .env

DEV_PROJECT_NAME := dev/$(PROJECT_NAME)
DEV_COMPOSE_FILE := docker-compose.dev.yml

.PHONY: all publish develop clean fclean re

all: develop

publish:
	@echo "\n\033[0;33m[Build publish environment]\033[0m"
	@docker-compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up --build

develop:
	@echo "\n\033[0;33m[Build develop environment]\033[0m"
	@docker-compose -p $(DEV_PROJECT_NAME) -f $(DEV_COMPOSE_FILE) --env-file $(ENV_FILE) up --build

clean:
	@echo "\n\033[0;33m[clean all containers containers]\033[0m"
	@docker container rm -f `docker-compose ps -aq`

fclean:
	@echo "\n\033[0;33m[clean all containers containers]\033[0m"
	@docker container rm -f `docker-compose ps -aq`
	@echo "\n\033[0;33m[clean all images]\033[0m"
	@docker image rm -f `docker-compose images -aq`
	@echo "\n\033[0;33m[clean all volumes]\033[0m"
	@docker volume rm `docker volume ls -q`

re:
	@make fclean
	@make all
