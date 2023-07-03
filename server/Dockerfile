FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

#create prisma.schema
RUN npm install -g prisma
RUN prisma init
# Copy the rest of the application code to the container
COPY . .

# generate model in prisma
RUN prisma db pull
RUN prisma generate
# Expose port 5000 for the Node.js application
EXPOSE 5000

# Start the Node.js application
CMD ["npm", "start"]