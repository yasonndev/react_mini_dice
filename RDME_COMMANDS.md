# Commands for helping

### To run debugging
`watchfiles "python app/main.py" app`

`pip install -r requirements.txt`
`pip install watchfiles`

### To work with docker

# Первый запуск - сборка образа
`docker-compose up --build`
`docker-compose up`
`docker-compose up -d`
`docker-compose down`

`docker-compose logs -f bot`

docker exec -it telegram_bot ping admin.cozyjack.dev.com

### Additional commands

# Очистить все контейнеры и volumes
docker-compose down -v

# Перестроить образ без кэша
docker-compose up --build --no-cache

# Выполнить команду в контейнере
docker-compose exec bot python -c "import redis; print(redis.Redis(host='redis').ping())"

# Войти в shell контейнера
docker-compose exec bot bash