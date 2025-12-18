.PHONY: help install dev build test deploy clean

help:
	@echo "Loan Management System - Available Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Start development environment"
	@echo "  make install          - Install dependencies"
	@echo "  make test             - Run tests"
	@echo ""
	@echo "Production:"
	@echo "  make build            - Build for production"
	@echo "  make deploy           - Deploy to production"
	@echo "  make health-check     - Run health checks"
	@echo ""
	@echo "Infrastructure:"
	@echo "  make tf-init          - Initialize Terraform"
	@echo "  make tf-plan          - Plan Terraform changes"
	@echo "  make tf-apply         - Apply Terraform changes"
	@echo "  make tf-destroy       - Destroy infrastructure"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build     - Build Docker images"
	@echo "  make docker-up        - Start Docker containers"
	@echo "  make docker-down      - Stop Docker containers"
	@echo ""
	@echo "Maintenance:"
	@echo "  make backup           - Backup MongoDB"
	@echo "  make logs             - View application logs"
	@echo "  make clean            - Clean build artifacts"

install:
	cd backend && npm ci
	cd frontend-unified && npm ci

dev:
	docker-compose up -d

build:
	cd backend && npm run build
	cd frontend-unified && npm run build

test:
	cd backend && npm test

deploy:
	./scripts/ec2-complete-setup.sh

health-check:
	./scripts/health-check.sh

tf-init:
	cd infrastructure/terraform && terraform init

tf-plan:
	cd infrastructure/terraform && terraform plan

tf-apply:
	cd infrastructure/terraform && terraform apply

tf-destroy:
	cd infrastructure/terraform && terraform destroy

docker-build:
	docker-compose build

docker-up:
	docker-compose -f docker-compose.prod.yml up -d

docker-down:
	docker-compose -f docker-compose.prod.yml down

backup:
	./scripts/backup-mongodb.sh

logs:
	pm2 logs loan-crm-api

clean:
	rm -rf backend/dist backend/logs
	rm -rf frontend-unified/dist
	docker system prune -f
