// import { Server as SocketIOServer } from 'socket.io';
// import prisma from '@prisma/client';

// export const setupSocketIO = (server: any) => {
//     const io = new SocketIOServer(server);

//     io.on('connection', (socket) => {
//         console.log('Client connected:', socket.id);

//         socket.on('disconnect', () => {
//             console.log('Client disconnected:', socket.id);
//         });

//         // Example event to handle client messages
//         socket.on('updateCompany', async (data) => {
//             console.log('Update Company:', data);
//             try {
//                 const { id, price } = data;
//                 const updatedStock = await prisma.stock.update({
//                     where: { id },
//                     data: { prices: price },
//                 });
//                 io.emit('companyUpdated', updatedStock);
//             } catch (error) {
//                 console.error('Error updating company:', error);
//             }
//         });

//         // Example of emitting an event to all clients
//         io.emit('welcome', { message: 'Welcome to the Socket.IO server!' });
//     });
// };
