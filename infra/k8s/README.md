# Kubernetes Notes for Version 2

This folder starts the Kubernetes layer for the version 2 architecture.

What is included here:
- a deployment and service for the API
- a Redis deployment and service
- an ingress that acts like the load balancer entry point

What is intentionally not fully expanded yet:
- a full Kafka cluster manifest
- service mesh configuration
- autoscaling rules

For Kafka in Kubernetes, the usual next step is to install it with a Helm chart or operator instead of hand-writing every StatefulSet detail.

That keeps the learning path realistic without turning this repo into a full infrastructure project all at once.
