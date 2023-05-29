docker rm --volumes server
docker image rm webnhatro-server
docker compose up -d server