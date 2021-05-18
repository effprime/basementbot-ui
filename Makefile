image = effprime/basement-bot-ui
dev-image = $(image):dev
prod-image = $(image):prod

dev:
	docker build -t $(dev-image) -f Dockerfile.dev .

prod:
	docker build -t $(prod-image) -f Dockerfile .

upd:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

upp:
	docker-compose -f docker-compose.yml up -d

down:
	docker-compose down

reboot:
	make down && make dev && make upd && make logs

restart:
	docker-compose restart

logs:
	docker logs basement_bot_ui -f
