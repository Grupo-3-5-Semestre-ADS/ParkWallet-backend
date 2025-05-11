import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const chatServiceUrl = `http://${process.env.CHAT_HOST}:${process.env.CHAT_PORT}/api/chats`;

const userToSocketMap = new Map();
const socketToUserMap = new Map();

export function initializeSocketIO(io) {
    io.on('connection', (socket) => {
        console.log(`Gateway: Novo cliente conectado: ${socket.id}`);

        socket.on('user_online', (data) => {
            const {userId} = data;
            if (userId) {
                console.log(`Gateway: Usuário ${userId} ficou online com socket ${socket.id}`);
                userToSocketMap.set(userId, socket.id);
                socketToUserMap.set(socket.id, userId);

                socket.emit('online_ack', {message: `Você está online como usuário ${userId}`});

            } else {
                socket.emit('error_message', {message: 'userId é obrigatório para user_online'});
            }
        });

        socket.on('send_message', async (data) => {
            const senderUserId = socketToUserMap.get(socket.id);

            if (!senderUserId) {
                console.error(`Gateway: Impossível enviar mensagem. Socket ${socket.id} não autenticado com userId.`);
                socket.emit('error_message', {message: 'Usuário não autenticado neste socket. Envie o evento "user_online" primeiro.'});
                return;
            }

            const {recipientUserId, message} = data;

            if (!recipientUserId || !message) {
                socket.emit('error_message', {message: 'recipientUserId e message são obrigatórios.'});
                return;
            }

            console.log(`Gateway: Mensagem de ${senderUserId} para ${recipientUserId}: "${message}"`);

            try {
                const chatPayload = {
                    senderUserId: parseInt(senderUserId, 10),
                    recipientUserId: parseInt(recipientUserId, 10),
                    message: message,
                    wasRead: false
                };

                console.log(chatServiceUrl)

                const response = await axios.post(chatServiceUrl, chatPayload);

                const savedMessage = response.data || {
                    ...chatPayload,
                    id: null,
                    createdAt: new Date().toISOString()
                };

                console.log('Gateway: Mensagem salva no microserviço de chat:', savedMessage);

                const recipientSocketId = userToSocketMap.get(parseInt(recipientUserId, 10));
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('receive_message', savedMessage);
                    console.log(`Gateway: Mensagem enviada para o socket do destinatário ${recipientSocketId}`);
                } else {
                    console.log(`Gateway: Destinatário ${recipientUserId} não está online. Mensagem salva, mas não entregue em tempo real.`);
                }

                socket.emit('message_sent_ack', savedMessage);

            } catch (error) {
                console.error('Gateway: Erro ao salvar mensagem no microserviço ou ao enviar para destinatário:',
                    error.response ? error.response.data : error.message
                );
                socket.emit('error_message', {
                    message: 'Falha ao processar sua mensagem.',
                    details: error.response ? error.response.data : error.message
                });
            }
        });

        socket.on('disconnect', () => {
            const userId = socketToUserMap.get(socket.id);
            if (userId) {
                userToSocketMap.delete(userId);
                socketToUserMap.delete(socket.id);
                console.log(`Gateway: Usuário ${userId} (socket ${socket.id}) desconectado.`);
            } else {
                console.log(`Gateway: Cliente desconectado (socket não identificado com userId): ${socket.id}`);
            }
        });
    });
}
