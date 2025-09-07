const prisma = require("../prisma/client.js");

exports.newConversation = async (req, res) => {
  const { to } = req.body;
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

  req.chat = conversation;
  console.log(req.chat)
  return res.json({ conversation });
};
exports.deleteConversation = async (req, res) => {
  //only deletes conversation for user
};
exports.getConversation = async (req, res) => {
  console.log('req', req.params)
  const { id } = req.params
  if (!req.user) {
    return res.sendStatus(401);
  }
  const messages = await prisma.message.findMany({
    where: {
      chat_id: id,
    },
    orderBy: {
      sent_at: "desc",
    },

  });
  console.log("mess", messages)
  return res.json(messages);
};

exports.getAllConversations = async (req, res) => {
  let chats = [];
  const id = req.user.id;
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

  console.log(req.body)
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
          id: "", // update
        },
      },
    },
  });

  return res.json(prismaMessage);
};



exports.deleteMessage = async (req, res) => {
  //only able to delete when recipient has not read it
};
exports.updateMessage = async (req, res) => {
  //only able to update when recipient has not read it
};
