---
name: backend-dev
description: Expert Node.js, Express.js, TypeScript, and MongoDB/Mongoose backend architecture skill. Use when designing, building, debugging, optimizing, or securing backend REST APIs, authentication (JWT/RBAC), database schemas, payment gateways (SSLCommerz, Stripe), or cloud integrations (Cloudinary, email services).
---

# Backend Development Skill (`backend-dev`)

This skill equips the agent with industry-standard patterns and guidelines for developing scalable, secure, and maintainable Node.js, Express, TypeScript, and MongoDB backend applications.

---

## 1. Architecture & Folder Structure

Follow the **Modular Controller-Service-Repository Pattern**:
```
src/
├── app/
│   ├── config/             # Environment variables, dotenv, db connection
│   ├── errors/             # Custom AppError, CastError, ValidationError handlers
│   ├── middlewares/        # auth, globalErrorHandler, notFound, validateRequest
│   ├── modules/            # Feature modules (e.g. auth, user, product, order, review)
│   │   └── [module]/
│   │       ├── [module].interface.ts
│   │       ├── [module].model.ts
│   │       ├── [module].validation.ts   # Zod / Joi validation schema
│   │       ├── [module].service.ts      # Pure business logic
│   │       ├── [module].controller.ts   # Request/response orchestration
│   │       ├── [module].route.ts        # Express Router definition
│   │       └── [module].constant.ts
│   ├── routes/             # Master router mounting all sub-routes
│   └── utils/              # sendResponse, catchAsync, pick, queryScope
├── app.ts                  # Express application setup, cors, helmet, parsers
└── server.ts               # Database connection and HTTP server listener
```

---

## 2. Authentication & Authorization Standard

### Token Lifecycle
1. **Access Token**: Short-lived (15m - 2h), signed with HMAC SHA256 (`JWT_ACCESS_SECRET`).
2. **Refresh Token**: Long-lived (7d - 30d), stored securely as HTTP-only cookie or DB token table.
3. **Password Hashing**: `bcryptjs` with salt rounds >= 10.

### Middleware Implementation
```typescript
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import AppError from "../errors/AppError";

export const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.accessToken || req.cookies?.token;

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
      req.user = decoded;

      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden: Insufficient privileges!");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
```

---

## 3. Database & Mongoose Best Practices

1. **Schemas & Types**: Always pair Mongoose schema with TypeScript interfaces.
2. **Indexes**: Index frequently queried fields (`slug`, `email`, `category`, `status`, `createdAt`).
3. **Soft Deletes**: Use `isDeleted: { type: Boolean, default: false }` for critical records (orders, users).
4. **Transactions**: Use `mongoose.startSession()` for multi-document operations (e.g. creating order + reducing product inventory).

```typescript
const session = await mongoose.startSession();
try {
  session.startTransaction();
  // 1. Check & decrement product stock
  // 2. Create order document
  // 3. Clear customer cart
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

## 4. Payment Integrations (SSLCommerz & Local Gateways)

1. **Idempotency**: Maintain a unique `transactionId` (`tran_id`) per order. Never re-process already confirmed transactions.
2. **IPN Validation**: Implement Instant Payment Notification (IPN) webhook listener and validate payment hash with SSLCommerz server before updating order status to `PAID`.
3. **Fail & Cancel Handling**: Always redirect user to descriptive frontend pages (`/checkout/fail`, `/checkout/cancel`).

---

## 5. Security & Production Checklist

- [ ] Rate limiting on sensitive endpoints (`express-rate-limit` on `/auth/login`, `/auth/register`).
- [ ] Cross-Origin Resource Sharing (`cors`) restricted to approved origins.
- [ ] Request body size limits (e.g. `express.json({ limit: "10mb" })`).
- [ ] Sanitize input to prevent NoSQL injection (`mongo-sanitize`).
- [ ] Centralized error handler returning structured JSON (`{ success: false, message, errorSources, stack }`).
