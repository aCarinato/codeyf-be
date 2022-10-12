import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

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
        $set: {
          hasNotifications: true,
        },
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
      await Conversation.updateOne(
        { _id: _id },
        { $set: { lastMessageIsRead: true } }
      );

      res.status(200).json({ success: true });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
