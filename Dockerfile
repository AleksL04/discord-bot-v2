# 1. Use the lightweight Alpine image for production
FROM node:22-alpine

# 2. Install ffmpeg
# In your devcontainer you used 'apt', but Alpine uses 'apk'.
# We use --no-cache to keep the image small.
RUN apk add --no-cache ffmpeg

# 3. Set the working directory
WORKDIR /app

# 4. Copy package files named specifically
# We do this BEFORE copying the rest of the code. 
# Docker will cache this step. If you change code but not dependencies,
# it won't have to re-install npm packages.
COPY package.json package-lock.json ./

# 5. Install dependencies
# 'npm ci' is faster and more reliable than 'npm install' for production.
# --only=production skips devDependencies (like eslint) to save space.
RUN npm ci --only=production

# 6. Copy the rest of your bot's code
COPY . .

# 7. Set the environment to production
# This tells libraries (like discord.js) to run in optimized mode.
ENV NODE_ENV=production

# 8. Start the bot
# We chain these commands to ensure slash commands update every time the container starts.
CMD ["sh", "-c", "node deploy-commands.js && node index.js"]