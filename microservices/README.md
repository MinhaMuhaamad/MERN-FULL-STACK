# Microservices Architecture - Exam Study Guide

## 🎯 Key Concepts for Final Exam

### What are Microservices?
- **Definition**: Architectural pattern where applications are built as a collection of small, independent services
- **Contrast with Monolith**: Single deployable unit vs. multiple independent services
- **Communication**: Services communicate via APIs (REST, GraphQL) or message queues

### Core Principles
1. **Single Responsibility**: Each service has one business capability
2. **Decentralized**: Independent development, deployment, and scaling
3. **Fault Isolation**: Failure in one service doesn't crash entire system
4. **Technology Diversity**: Different services can use different tech stacks

## 📋 Exam Topics Breakdown

### 1. Service Decomposition
```
Monolith → Microservices
- User Service (Authentication, Profiles)
- Post Service (CRUD operations)
- Notification Service (Email, Push)
- File Service (Image uploads)
```

### 2. Communication Patterns
- **Synchronous**: HTTP/REST APIs, GraphQL
- **Asynchronous**: Message queues (RabbitMQ, Apache Kafka)
- **Service Discovery**: How services find each other

### 3. Data Management
- **Database per Service**: Each microservice owns its data
- **Data Consistency**: Eventual consistency vs. ACID transactions
- **Distributed Transactions**: Saga pattern

### 4. Deployment & Scaling
- **Containerization**: Docker containers
- **Orchestration**: Kubernetes, Docker Swarm
- **Load Balancing**: Distribute traffic across instances
- **Auto-scaling**: Scale based on demand

## 🛠 Practical Examples

### Example 1: E-commerce System
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Service  │    │ Product Service │    │  Order Service  │
│                 │    │                 │    │                 │
│ - Registration  │    │ - Catalog       │    │ - Cart          │
│ - Authentication│    │ - Inventory     │    │ - Checkout      │
│ - Profile       │    │ - Search        │    │ - Payment       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  API Gateway    │
                    │                 │
                    │ - Routing       │
                    │ - Authentication│
                    │ - Rate Limiting │
                    └─────────────────┘
```

### Example 2: Our MERN Application as Microservices
```
Current Monolith:
- Frontend (React)
- Backend (Node.js + Express)
- Database (MongoDB)

Microservices Version:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Auth Service   │    │  Post Service   │    │  User Service   │
│                 │    │                 │    │                 │
│ - Login/Register│    │ - CRUD Posts    │    │ - User Profiles │
│ - JWT Tokens    │    │ - Like/Comment  │    │ - User Settings │
│ - Password Hash │    │ - Search        │    │ - User Stats    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Implementation Strategies

### 1. API Gateway Pattern
```javascript
// Example API Gateway routing
const routes = {
  '/api/auth/*': 'http://auth-service:3001',
  '/api/posts/*': 'http://post-service:3002',
  '/api/users/*': 'http://user-service:3003'
}
```

### 2. Service Communication
```javascript
// Synchronous communication
const userResponse = await fetch('http://user-service/api/users/123')
const userData = await userResponse.json()

// Asynchronous messaging
messageQueue.publish('user.created', { userId: 123, email: 'user@example.com' })
```

### 3. Database per Service
```
Auth Service → MongoDB (Users, Sessions)
Post Service → PostgreSQL (Posts, Comments)
Analytics Service → Redis (Metrics, Cache)
```

## 📚 Exam Questions You Should Be Able to Answer

### Conceptual Questions
1. **What are the main benefits of microservices architecture?**
   - Independent scaling
   - Technology diversity
   - Fault isolation
   - Team autonomy

2. **What are the challenges of microservices?**
   - Network complexity
   - Data consistency
   - Service discovery
   - Monitoring/debugging

3. **When should you use microservices vs. monolith?**
   - Microservices: Large teams, complex domains, need for scaling
   - Monolith: Small teams, simple domains, rapid prototyping

### Technical Questions
1. **How do microservices communicate?**
   - REST APIs, GraphQL, Message queues, gRPC

2. **How do you handle data consistency?**
   - Eventual consistency, Saga pattern, Event sourcing

3. **How do you deploy microservices?**
   - Containers (Docker), Orchestration (Kubernetes), CI/CD pipelines

## 🎯 Quick Study Tips for Exam

### 1. Understand the Trade-offs
- **Monolith Pros**: Simple deployment, easier debugging, better performance
- **Microservices Pros**: Scalability, technology diversity, team independence
- **When to choose each**: Team size, complexity, scaling needs

### 2. Know the Patterns
- **API Gateway**: Single entry point for all client requests
- **Service Discovery**: How services find and communicate with each other
- **Circuit Breaker**: Prevent cascading failures
- **Saga Pattern**: Manage distributed transactions

### 3. Practical Implementation
- **Docker**: Containerization for consistent deployment
- **Load Balancer**: Distribute traffic across service instances
- **Message Queue**: Asynchronous communication between services
- **Database per Service**: Data ownership and independence

## 🔗 Allowed Resources for Reference
- **MDN**: For web standards and APIs
- **Node.js docs**: For backend implementation
- **MongoDB docs**: For database design
- **React docs**: For frontend architecture

## ⚡ Last-Minute Review Checklist
- [ ] Can explain microservices vs. monolith
- [ ] Know communication patterns (sync/async)
- [ ] Understand data management strategies
- [ ] Can describe deployment approaches
- [ ] Know when to use microservices
- [ ] Understand common patterns (API Gateway, Service Discovery)
- [ ] Can identify benefits and challenges
- [ ] Know how to handle failures and scaling
