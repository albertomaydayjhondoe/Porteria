FROM ruby:3.0-alpine

# Install dependencies
RUN apk add --no-cache \
    build-base \
    git \
    nodejs \
    npm

# Set working directory
WORKDIR /app

# Install Jekyll and Bundler
RUN gem install jekyll bundler

# Copy Gemfile
COPY Gemfile* ./

# Install gems
RUN bundle install

# Copy project files
COPY . .

# Expose port
EXPOSE 4000

# Start Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--livereload"]
