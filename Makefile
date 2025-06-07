# Variables
APP_NAME = web

# Help target
help: ## Show this help message
	@echo "Available targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Build targets
build: ## Build Next.js application
	@echo "Building Next.js application..."
	npm run build

install: ## Install dependencies
	@echo "Installing dependencies..."
	npm ci

lint: ## Run ESLint
	@echo "Running lint..."
	npm run lint

dev: ## Start development server
	@echo "Starting development server..."
	npm run dev

# Docker-related targets

# Check if required variables are set
check-docker-vars:
	@if [ -z "$(ORG)" ]; then \
		echo "Error: ORG variable is required"; \
		echo "Usage: make docker-build ORG=iddaalens.azurecr.io TAG=latest"; \
		exit 1; \
	fi
	@if [ -z "$(TAG)" ]; then \
		echo "Error: TAG variable is required"; \
		echo "Usage: make docker-build ORG=iddaalens.azurecr.io TAG=latest"; \
		exit 1; \
	fi

docker-build-local: ## Build Docker image locally
	@echo "Building local Docker image..."
	docker build -t $(APP_NAME):latest .

docker-build: check-docker-vars ## Build Docker image with tags (ORG=org TAG=tag)
	@echo "Building Docker image $(ORG)/$(APP_NAME):$(TAG)..."
	docker build -t $(ORG)/$(APP_NAME):$(TAG) .

docker-push: check-docker-vars ## Push Docker image (ORG=org TAG=tag)
	@echo "Pushing Docker image $(ORG)/$(APP_NAME):$(TAG)..."
	docker push $(ORG)/$(APP_NAME):$(TAG)

docker-build-and-push: docker-build docker-push ## Build and push Docker image (ORG=org TAG=tag)

# Deployment targets
deploy: ## Deploy to Kubernetes using deploy.sh
	@echo "Deploying to Kubernetes..."
	./deploy.sh

# Kubernetes targets
k8s-apply: ## Apply Kubernetes manifests
	@echo "Applying Kubernetes manifests..."
	kubectl apply -f k8s/

k8s-delete: ## Delete Kubernetes resources
	@echo "Deleting Kubernetes resources..."
	kubectl delete -f k8s/ || true

k8s-status: ## Show Kubernetes deployment status
	@echo "Checking deployment status..."
	kubectl get pods,svc,ingress -l app=iddaa-lens-web

k8s-logs: ## Show application logs
	@echo "Showing application logs..."
	kubectl logs -l app=iddaa-lens-web -f

# Clean targets
clean: ## Clean build artifacts
	@echo "Cleaning build artifacts..."
	rm -rf .next
	rm -rf node_modules/.cache

clean-docker: ## Remove local Docker images
	@echo "Removing local Docker images..."
	docker rmi $(APP_NAME):latest || true

.PHONY: help build install lint dev check-docker-vars docker-build-local docker-build docker-push docker-build-and-push deploy k8s-apply k8s-delete k8s-status k8s-logs clean clean-docker