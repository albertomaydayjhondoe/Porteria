FROM ruby:3.2-alpine

# Install dependencies including gcompat for better binary compatibility
RUN apk add --no-cache \
    build-base \
    git \
    nodejs \
    npm \
    gcompat

# Set working directory
WORKDIR /app

# Install Jekyll and Bundler
RUN gem install jekyll bundler

# Copy Gemfile
COPY Gemfile* ./

# Clean bundle cache and install gems fresh
RUN rm -rf /usr/local/bundle/cache && bundle install --full-index

# Copy project files
COPY . .

# Build the Jekyll site
RUN bundle exec jekyll build

# Expose port
EXPOSE 4000

# Start Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--livereload"]
