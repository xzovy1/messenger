const db = require("../db/chatQueries.js");

exports.newConversation = async (req, res) => {
  const { to } = req.body;
  const senderId = req.user.id;
  const recipientId = to;
  if (!recipientId) {
    res.status(400).json({ message: "Recipient not found" });
    return;
  }
  if (!senderId) {
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
exports.deleteConversation = async (req, res) => {
  //only deletes conversation for user
  // to only delete for use it should be handled on the front end
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: "Conversation not found" });
    return;
  }
  await db.deleteConversation(id);
  res.json({ message: ` chat ${id} deleted` });
};

exports.getConversation = async (req, res) => {
  const { id } = req.params; // conversation id
  if (!req.user) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  if (!id) {
    res.status(400).json({ message: "Conversation not found" });
    return;
  }
  let messages = await db.getConversation(id);
  const recentMessage = messages[messages.length - 1];
  if (
    recentMessage &&
    req.user.id == recentMessage.recipient_id &&
    !recentMessage.read
  ) {
    const messageId = messages[messages.length - 1].id;
    await db.markMessageRead(messageId);
    messages = await db.getConversation(id);
    // console.log("message read");
  }
  res.json(messages);
};

exports.getAllConversations = async (req, res) => {
  const id = req.user.id;
  if (!id) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const chats = await db.getAllConversations(id);
  res.json(chats);
};

exports.sendMessage = async (req, res) => {
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

  await db.sendMessage(sender, recipient, body, id);

  res.json({ message: `message sent to ${recipient}` });
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
