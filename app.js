import express from 'express';
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';

// SOCKET CONTROLLERS
// socket controllers
import {
  getUsers,
  addUser,
  removeUserOnLeave,
  removeUser,
  findConnectedUser,
} from './controllers/socket/room.js';

import {
  loadMessages,
  sendChatMsg,
  setMsgToUnread,
  setChatNotification,
  readNotification,
} from './controllers/socket/chats.js';

import {
  setJoinReqNotification,
  setJoinReqNotificationSender,
  setJoinReqNotificationReceiver,
} from './controllers/socket/groups.js';

// ROUTES
import people from './routes/people.js';
import auth from './routes/auth.js';
import user from './routes/user.js';
import admin from './routes/admin.js';
// import message from './routes/message.js';
import chats from './routes/chats.js';
import groups from './routes/groups.js';

connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } }); // TEST socket on vercel

io.on('connection', (socket) => {
  // console.log(`socket id: ${socket.id}`);

  socket.on('join', async ({ userId }) => {
    // console.log(`suser id: ${userId}`);
    const users = await addUser(userId, socket.id);

    setInterval(() => {
      // filter out the current user
      socket.emit('connectedUsers', {
        users: users.filter((user) => user.userId !== userId),
      });
    }, 10000);
  });

  socket.on('disconnect', async () => {
    // socket.disconnect();
    const testone = getUsers();
    const incriminato = testone.filter((user) => user.socketId === socket.id);
    if (incriminato !== undefined && incriminato.length > 0) {
      const incriminatoId = incriminato[0].userId;
      const newUsers = await removeUserOnLeave(incriminatoId, socket.id);
    }
  });

  socket.on('loadMessages', async ({ userId, messagesWith }) => {
    // console.log(
    //   `FROM SOCKET 'loadMessages' - userId: ${userId}, messagesWith: ${messagesWith}`
    // );
    const { chat, error } = await loadMessages(userId, messagesWith);

    !error
      ? socket.emit('messagesLoaded', { chat })
      : socket.emit('noChatFound', { error });
  });

  socket.on('sendNewChatMsg', async ({ userId, receiverId, msg }) => {
    // create a new message and store it in the database for the sender and receiver (Chat.js)
    const { newMsg, error } = await sendChatMsg(userId, receiverId, msg);

    // Check if the receiver is online
    const receiverSocket = findConnectedUser(receiverId);
    // console.log(receiverSocket);

    if (receiverSocket) {
      // the receiver is online, but  not necessarily on the message page. In that case it still needs a notification
      //  That will have to be handled in the frontend
      // WHEN YOU WANT TO SEND MESSAGE TO A PARTICULAR SOCKET
      io.to(receiverSocket.socketId).emit('newMsgReceived', { newMsg });
    }
    //
    else {
      await setMsgToUnread(userId, receiverId);
      await setChatNotification(userId, receiverId);
    }

    !error && socket.emit('msgSent', { newMsg });
    // socket.emit('notificationSent');
  });

  socket.on('sendChatNotification', async ({ senderId, receiverId }) => {
    // console.log(`senderId: ${senderId} receiverId: ${receiverId}`);
    await setChatNotification(senderId, receiverId);
  });

  socket.on('readNotification', async ({ notificationTo, msgFrom }) => {
    await readNotification(notificationTo, msgFrom);
  });

  // GROUPS
  socket.on('joinGroupReq', async ({ senderId, receiverId, groupId }) => {
    // console.log(
    //   `senderId: ${senderId}, receiverId: ${receiverId},  groupId: ${groupId}`
    // );

    // set notification on sender - the sender is certainly online and the notifications will be added there too
    const { alreadyExists } = await setJoinReqNotificationSender(
      senderId,
      receiverId,
      groupId
    );

    if (!alreadyExists) {
      // Check if the receiver is online
      const receiverSocket = findConnectedUser(receiverId);

      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('joinReqNotification', {
          senderId,
          receiverId,
          groupId,
        });
      } else {
        //  set the notification in the db for the received. when he opens the app it will be loaded
        await setJoinReqNotificationReceiver(senderId, receiverId, groupId);
      }
    }
  });

  socket.on(
    'saveJoinReqNotification',
    async ({ senderId, receiverId, groupId }) => {
      // console.log(
      //   `senderId: ${senderId}, receiverId: ${receiverId},  groupId: ${groupId}`
      // );
      await setJoinReqNotificationReceiver(senderId, receiverId, groupId);
    }
  );

  socket.on('leave', async ({ userId }) => {
    const users = await removeUserOnLeave(userId, socket.id);
  });
});

const port = process.env.PORT || 8000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE'
  );

  next();
});

app.use('/api/people', people);
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/admin', admin);
// app.use('/api/message', message);
app.use('/api/chats', chats);
app.use('/api/groups', groups);

httpServer.listen(port, () => console.log(`Server running on port ${port}`));
