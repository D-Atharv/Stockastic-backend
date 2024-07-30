import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

prisma.$connect().then( () => {
    if (prisma) {
        console.log("Connected to prisma");
    }
    else{
        console.log("Error connecting to prisma");
    }
});

export default prisma;