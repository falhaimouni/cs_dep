SHELL := /bin/sh

FRONTEND_URL := http://localhost:5173
API_URL := http://localhost:4000/api

.PHONY: all help install dev api api-dev build lint check preview health clean

all:
	@trap 'kill 0' INT TERM EXIT; \
	npm run api & \
	npm run dev & \
	wait

help:
	@echo "CS Department Platform shortcuts"
	@echo ""
	@echo "  make all       Run backend and frontend together"
	@echo "  make install   Install npm dependencies"
	@echo "  make dev       Run frontend dev server"
	@echo "  make api       Run backend API server"
	@echo "  make api-dev   Run backend API server with watch mode"
	@echo "  make build     Build frontend for production"
	@echo "  make lint      Run ESLint"
	@echo "  make check     Run lint and build"
	@echo "  make preview   Preview production build"
	@echo "  make health    Check frontend and backend URLs"
	@echo "  make clean     Remove dist"

install:
	npm install

dev:
	npm run dev

api:
	npm run api

api-dev:
	npm run api:dev

build:
	npm run build

lint:
	npm run lint

check: lint build

preview:
	npm run preview

health:
	@echo "Frontend:"
	@curl -s -I $(FRONTEND_URL) | sed -n '1p' || true
	@echo "Backend:"
	@curl -s $(API_URL)/health || true
	@echo ""

clean:
	rm -rf dist
