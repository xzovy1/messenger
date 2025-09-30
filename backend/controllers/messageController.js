const db = require("../db/chatQueries.js");
const { getUser } = require("../db/userQueries.js")

exports.newConversation = async (req, res) => {
  const { recipientId } = req.body;
  const senderId = req.user.id;

  if (!recipientId) {
    res.status(400).json({ message: "Recipient not found" });
    return;
  }
  try {
    await getUser(recipientId);
  } catch {
    res.status(400).json({ message: "Recipient not found" });
    return
  }
  if (!senderId || senderId != req.user.id) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  try {
    const conversation = await db.newConversation(senderId, recipientId);
    req.chat = conversation;
    return res.json({ conversation });
  } catch (error) {
    res.status(400).send({ message: `unable to create conversation with user id ${recipientId}` })
  }
};
exports.deleteConversation = async (req, res, next) => {
  //only deletes conversation for user
  // to only delete for use it should be handled on the front end
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: "Conversation not found" });
    return;
  }
  try {

    await db.deleteConversation(id);
    res.json({ message: ` chat ${id} deleted` });
  } catch (error) {
    next(error)
  }
};

exports.getConversation = async (req, res, next) => {
  const { id } = req.params; // conversation id
  if (!req.user) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  if (!id) {
    res.status(400).json({ message: "Conversation not found" });
    return;
  }
  try {
    let messages = await db.getConversation(id);
    const recentMessage = await db.getNewestMessage(id);
    if (
      recentMessage &&
      req.user.id == recentMessage.recipient_id &&
      !recentMessage.read
    ) {
      const messageId = recentMessage.id;
      await db.markMessageRead(messageId);
      messages = await db.getConversation(id);
    }
    res.json(messages);

  } catch (error) {
    next(error)
  }
};

exports.getAllConversations = async (req, res, next) => {
  const id = req.user.id;
  if (!id) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  try {
    const chats = await db.getAllConversations(id);
    res.json(chats);
  } catch (error) {
    next(error)
  }
};

exports.sendMessage = async (req, res, next) => {
  const { id } = req.params; //chat id
  const { body, recipient } = req.body;
  const sender = req.user.id;
  if (!id) {
    res.status(404).json({ message: "Conversation not found" });
    return;
  }
  if (!recipient) {
    res.status(404).json({ message: "Recipient not found" });
    return;
  }
  try {

    await db.sendMessage(sender, recipient, body, id);
    res.json({ message: `message sent to ${recipient}` });
  } catch (error) {
    next(error)
  }
};

exports.deleteMessage = async (req, res) => {
  // const {id} = req.params;
  // console.log(id)
  // const chat = await prisma.chat.delete({
  //   where: {
  //     id
  //   }
  // })
  // console.log(chat)
  // res.json(chat)
  //only able to delete when recipient has not read it
};
exports.updateMessage = async (req, res) => {
  //only able to update when recipient has not read it
};
