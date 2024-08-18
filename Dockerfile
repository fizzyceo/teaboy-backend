FROM node:18

WORKDIR /usr/src/app

# Copy only the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Prisma schema and run `prisma generate`
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["npm", "run", "start:prod"]
