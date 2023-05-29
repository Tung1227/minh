docker stop client
docker rm --volumes client
docker image rm webnhatro-client
docker compose up client