const { PrismaClient } = require('.prisma/client');
const { ApolloServer, PubSub } = require('apollo-server');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
    Query: {
        status: () => { return "I am alive" },
        posts: async (parent, args, context) => {
            data = await context.prisma.post.findMany();
            return data;
        },
        post: async (parent, args, context) => { return await context.prisma.post.findUnique({ where: { id: parseInt(args.id) } }) },
        users: async (parent, args, context) => { return await context.prisma.user.findMany() }
    },
    Mutation: {
        addPost: async (parent, args, context) => {
            post = { title: args.title, url: args.url, description: args.description, postedBy: { connect: { id: parseInt(args.userId) } } };
            post = await context.prisma.post.create({ data: post });
            context.pubsub.publish("NEW_POST", post);
            pubsub.sub
            return post;
        },
        addUser: async (parent, args, context) => {
            user = await context.prisma.user.create({ data: { name: args.name } })
            return user;
        }
    },
    Subscription: {
        newPost: {
            subscribe: (parent, args, context) => context.pubsub.asyncIterator("NEW_POST"),
            resolve: payload => { return payload }
        }

    },
    Post: {
        url: (parent, args, context) => { return 'http://' + parent.url },
        postedBy: async (parent, args, context) => {
            return await context.prisma.post.findUnique({
                where: {
                    id: parent.id
                }
            }).postedBy()
        }
    },
    User: {
        posts: async (parent, args, context) => {
            return prisma.user.findUnique({ where: { id: parent.id } }).posts()
        }
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: {
        prisma,
        pubsub
    }
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`));