local:
	make -j 2 local-server local-client
.PHONY: local

local-server:
	cd wamcalc; mvn spring-boot:run
.PHONY: local-server

local-client:
	cd client; npm start
.PHONY: local-client

build:
	cd client; npm install --legacy-peer-deps   
.PHONY: build

test:
	cd wamcalc; mvn test
.PHONY: test