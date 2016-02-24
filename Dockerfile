# Use a tiny version of linux, which you have to install node onto.
# Todo: lock the node version
FROM alpine
RUN apk add --update nodejs

# create app directory
RUN mkdir -p /website
WORKDIR /website

# Call all the pre-built app files to the apps dir
COPY . /website/

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon:
EXPOSE 3000

CMD ["npm", "start"]
