docker stop server
docker rm --volumes server
docker image rm webnhatro-server
docker compose up server