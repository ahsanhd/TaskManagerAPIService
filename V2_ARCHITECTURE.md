# Version 2 Architecture Plan

## Goal

Version 2 moves this project toward a distributed backend.

The main objectives are:
- introduce Redis caching
- introduce Kafka event publishing
- add a load balancer / reverse proxy layer
- prepare Kubernetes deployment manifests
- keep the codebase understandable while the architecture gets more advanced

## Important Note

The current app is still a single backend service.

That is intentional.
Before splitting into true microservices, the project needs a clean platform layer so the new systems can be observed in action without rewriting everything at once.

## What Is Already Wired In

- task list reads can cache through Redis
- task creates, updates, and deletes invalidate cache
- task changes publish Kafka events when Kafka settings are present
- the app can still run without Redis or Kafka because those integrations are optional

## Version 2 Building Blocks

### API Gateway / Load Balancer

This sits in front of the backend and routes traffic.
In Kubernetes, this will usually be handled by an Ingress controller or a LoadBalancer service.

### Redis Cache

Redis stores short-lived copies of frequently read data.
For this project, the task list for a user is cached briefly so repeated GET requests are faster.

### Kafka Event Bus

Kafka is used for events that other services can consume.
For this project, task created, updated, and deleted events are published to a topic.

### Kubernetes

Kubernetes will be used to run the app and its support services in a cluster.
It will give us:
- replication
- service discovery
- load balancing
- config and secret management

## Why This Is the Right Next Step

If we jump straight to splitting everything into microservices, the architecture becomes hard to learn from.

By first wiring caching, events, and deployment primitives into the current backend, we can see the infrastructure concepts working before the codebase becomes more complex.

## Recommended Next Phase

1. Add Docker Compose for local Redis and Kafka
2. Add Kubernetes manifests for API, Redis, and Kafka
3. Split the app into gateway plus domain services
4. Replace shared direct calls with service-to-service events and APIs