const prisma = require("../prisma/client.js");

exports.newConversation = async (req, res) => {
  const { message, to } = req.body;
  const senderId = req.user.id;
  const recipientId = to;
  const conversation = await prisma.chat.create({
    data: {
      users: {
        connect: [{ id: senderId }, { id: recipientId }],
      },
    },
    include: {
      users: true,
    },
  });
  return res.json({ conversation });
};
exports.deleteConversation = async (req, res) => {
  //only deletes conversation for user
};

exports.getAllConversations = async (req, res) => {
  if (!req.app.user) {
    return res.sendStatus(401);
  }
  let chats = [];
  const id = req.app.user.id;
  chats = await prisma.chat.findMany({
    where: {
      id,
    },
  });
  return res.json(chats);
};
//testconvo:
// const testChat = "a5efd84f-65a7-4d9f-84b4-3d910f77d4e1";
//

exports.newMessage = async (req, res) => {
  const { message, to } = req.body;
  const senderId = req.user.id;
  const recipientId = to;
  const prismaMessage = await prisma.message.create({
    data: {
      body: message,
      sender: {
        connect: {
          id: senderId,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
      chat: {
        connect: {
          id: testChat, // update
        },
      },
    },
  });

  return res.json(prismaMessage);
};

exports.getChatMessages = async (req, res) => {
  // const {chat} = req.param
  if (!req.user) {
    return res.sendStatus(401);
  }
  const messages = await prisma.message.findMany({
    where: {
      chat_id: testChat, // update
    },
    orderBy: {
      sent_at: "desc",
    },
  });
  res.json({ messages });
};

exports.deleteMessage = async (req, res) => {
  //only able to delete when recipient has not read it
};
exports.updateMessage = async (req, res) => {
  //only able to update when recipient has not read it
};
