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
  joinGroupReq,
  addUserToGroup,
  saveGroupJoinedNotification,
  readGroupJoinedNotification,
} from './controllers/socket/groups.js';

// ROUTES
import people from './routes/people.js';
import auth from './routes/auth.js';
import user from './routes/user.js';
import admin from './routes/admin.js';
// import message from './routes/message.js';
import chats from './routes/chats.js';
import groups from './routes/groups.js';
import assignments from './routes/assignments.js';
import individuals from './routes/individuals.js';

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

  // ----------- CHATS ----------- //
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
    // console.log(`From sendNewChatMsg - receiverSocket: ${receiverSocket}`);

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
  // ----------- END OF CHATS ----------- //

  // ----------- GROUPS ----------- //
  socket.on(
    'joinGroupReq',
    async ({ organiserId, groupId, userToAddId, type }) => {
      await joinGroupReq(organiserId, groupId, userToAddId, type);
      // const userToAddSocket = findConnectedUser(userToAddId);
    }
  );

  socket.on(
    'addUserToGroup',
    async ({ organiserId, groupId, userToAddId, type }) => {
      // console.log(
      //   `from app.js - 'addMentorToGroup' groupId; ${groupId}, receiverId: ${userToAddId}`
      // );
      const alreadyExists = await addUserToGroup(groupId, userToAddId, type);
      if (alreadyExists) {
        // emit event to inform the user
        const organiserSocket = findConnectedUser(organiserId);
        if (organiserSocket) {
          const msg = 'user already in the group';
          io.to(organiserSocket.socketId).emit('userToAddAlreadyJoined', {
            msg,
          });
        }
      } else {
        // send notification to buddyId
        // Check if the receiver is online
        const userToAddSocket = findConnectedUser(userToAddId);

        if (userToAddSocket) {
          // console.log(
          //   `2) FROM app.js socket.emit(joinedGroupNotification): mentorSocket.socketId: ${userToAddSocket.socketId}`
          // );
          io.to(userToAddSocket.socketId).emit('joinedGroupNotification', {
            organiserId,
            userToAddId,
            groupId,
            type,
          });
        } else {
          // save in the database
          await saveGroupJoinedNotification(
            organiserId,
            userToAddId,
            groupId,
            type
          );
        }
      }
    }
  );

  socket.on(
    'saveGroupJoinedNotification',
    async ({ organiserId, userToAddId, groupId, type }) => {
      // console.log(`6) from app.js 'saveGroupJoinedNotification'`);
      // save in the database
      await saveGroupJoinedNotification(
        organiserId,
        userToAddId,
        groupId,
        type
      );
    }
  );

  socket.on('readGroupJoinedNotification', async ({ notificationId }) => {
    await readGroupJoinedNotification(notificationId);
  });

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
app.use('/api/assignments', assignments);
app.use('/api/individuals', individuals);

httpServer.listen(port, () => console.log(`Server running on port ${port}`));
