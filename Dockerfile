# -------- Stage 1: Build Angular --------
FROM node:18-alpine AS build-angular
WORKDIR /app/angular
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build -- --configuration=production

# -------- Stage 2: Node.js Backend --------
FROM node:18-alpine
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
RUN npm install
COPY backend/ .


# Copy Angular build output (verify the correct path)
COPY --from=build-angular /app/angular/dist/frontend/browser ./src/public/

EXPOSE 3000
# Update this to match your actual main file:
CMD ["node", "src/index.js"]