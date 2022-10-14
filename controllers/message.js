import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import AdminNotification from '../models/AdminNotification.js';

// @desc    Send a message
// @route   POST /api/message/start-conversation
// @access  Private
export const startConversation = async (req, res) => {
  //   console.log(req.body);
  //   console.log(req.user._id);
  try {
    const { recipient, message } = req.body;

    // find sender
    const sender = await User.findById(req.user._id);
    const senderUserId = sender._id;

    //   find the id of the recipient
    const recipientUser = await User.findOne({ username: recipient });
    const recipientUserId = recipientUser._id;

    //   create a new message
    const createdMessage = new Message({
      from: senderUserId,
      to: recipientUserId,
      content: message,
    });

    const newMsg = await createdMessage.save();

    const createdConversation = new Conversation({
      lastMessageIsRead: false,
      firstUser: senderUserId,
      secondUser: recipientUserId,
      messages: createdMessage,
    });

    const newConversation = await createdConversation.save();

    await User.updateOne(
      { _id: sender._id },
      {
        $push: {
          conversations: createdConversation,
        },
      }
    );

    await User.updateOne(
      { _id: recipientUserId },
      {
        $push: {
          conversations: createdConversation,
        },
        $inc: { nNotifications: 1 },
        // $set: {
        //   hasNotifications: true,
        // },
      }
    );

    res.status(200).json({
      success: true,
      //   newMsg: createdMessage,
      //   newConversation: createdConversation,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// @desc    Get all messages for the user
// @route   POST /api/message/render-conversations
// @access  Private
// @refs    https://dev.to/paras594/how-to-use-populate-in-mongoose-node-js-mo0
export const renderConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ firstUser: req.user._id }, { secondUser: req.user._id }],
    })
      .populate('firstUser secondUser messages')
      .populate({
        path: 'messages',
        populate: { path: 'from to' },
      })
      //   .populate('firstUser secondUser messages')
      .sort({
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// @desc    Read last message from a conversation so it is not highlighted as 'unread' anymore (in the FE)
// @route   PUT /api/message/read-last-msg
// @access  Private
export const readLastMsg = async (req, res) => {
  try {
    const { _id } = req.body;
    let conversation;
    try {
      conversation = await Conversation.findById(_id);
    } catch (err) {
      console.log(err);
    }

    if (conversation) {
      const user = await User.findById(req.user._id);

      if (user.nNotifications > 0 && conversation.lastMessageIsRead === false) {
        await User.updateOne(
          { _id: req.user._id },
          { $inc: { nNotifications: -1 } }
          // { $set: { nNotifications: nNotifications - 1 } }
        );
      }

      await Conversation.updateOne(
        { _id: _id },
        { $set: { lastMessageIsRead: true } }
      );

      // updated user to send as a response
      const userResponse = await User.findById(req.user._id);
      // console.log(userResponse);

      res
        .status(200)
        .json({ success: true, nNotifications: userResponse.nNotifications });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// @desc    Read an admin notification so it is not highlighted as 'unread' anymore (in the FE)
// @route   PUT /api/message/read-notification
// @access  Private
export const readAdminNotification = async (req, res) => {
  try {
    // find the notification with specified id
    // console.log(req.body);
    const { notificationId } = req.body;
    // let notification;

    // notification = await AdminNotification.findById(notificationId);

    // if (notification.isRead === false) {
    await AdminNotification.updateOne(
      { _id: notificationId },
      { $set: { isRead: true } }
    );

    // update the number of notifications of the user
    await User.updateOne(
      { _id: req.user._id },
      { $inc: { nNotifications: -1 } }
    );

    // updated user to send as a response
    const userResponse = await User.findById(req.user._id);

    res
      .status(200)
      .json({ success: true, nNotifications: userResponse.nNotifications });
    // }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// @desc    Get all admin notifications for the user
// @route   POST /api/message/render-notifications
// @access  Private
// @refs    https://dev.to/paras594/how-to-use-populate-in-mongoose-node-js-mo0
export const renderAdminNotifications = async (req, res) => {
  try {
    const notifications = await AdminNotification.find({
      recipient: req.user._id,
    }).sort({
      updatedAt: -1,
    });

    // console.log(notifications);

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// @desc    Fetch a conversation given its _id
// @route   GET /api/message/render-conversation:_id
// @access  Private
export const renderConversation = async (req, res) => {
  try {
    const conversationId = req.params._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
    })
      .populate('firstUser secondUser messages')
      .populate({
        path: 'messages',
        populate: { path: 'from to' },
      })
      //   .populate('firstUser secondUser messages')
      .sort({
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// @desc    Send a message in a PM conversation (between 2 users) after a converstion has already started
// @route   POST /api/message/send-dm-msg
// @access  Private
export const sendDMMessage = async (req, res) => {
  console.log(req.body);
  //   console.log(req.user._id);
  try {
    const { conversationId, recipientId, newMessage } = req.body;

    // find sender
    // const sender = await User.findById(req.user._id);
    // const senderUserId = sender._id;

    // find conversation
    // const conversation = await Conversation.findById({ _id: conversationId });

    //   find the id of the recipient
    // const recipientUser = await User.findOne({ username: recipient });
    // const recipientUserId = recipientUser._id;

    //   create a new message
    const createdMessage = new Message({
      from: req.user._id,
      to: recipientId,
      content: newMessage,
    });

    const newMsg = await createdMessage.save();

    await Conversation.updateOne(
      { _id: conversationId },
      {
        $set: { lastMessageIsRead: false },
        $push: { messages: createdMessage },
      }
    );

    // notify the recipient
    await User.updateOne(
      { _id: recipientId },
      {
        $inc: { nNotifications: 1 },
      }
    );

    // const createdConversation = new Conversation({
    //   lastMessageIsRead: false,
    //   firstUser: senderUserId,
    //   secondUser: recipientUserId,
    //   messages: createdMessage,
    // });

    // const newConversation = await createdConversation.save();

    // await User.updateOne(
    //   { _id: sender._id },
    //   {
    //     $push: {
    //       conversations: createdConversation,
    //     },
    //   }
    // );

    // await User.updateOne(
    //   { _id: recipientUserId },
    //   {
    //     $push: {
    //       conversations: createdConversation,
    //     },
    //     $inc: { nNotifications: 1 },
    //   }
    // );

    res.status(200).json({
      success: true,
      //   newMsg: createdMessage,
      //   newConversation: createdConversation,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
