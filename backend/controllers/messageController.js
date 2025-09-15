const prisma = require("../prisma/client.js");

exports.newConversation = async (req, res) => {
  const { to } = req.body;
  const senderId = req.user.id;
  const recipientId = to;
  if(!recipientId){
    res.status(404).json({message: "Recipient not found"})
    return;
  }
    if(!senderId){
    res.status(404).json({message: "User not found"})
    return;
  }
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
  return res.json({ conversation });
};
exports.deleteConversation = async (req, res) => {
  //only deletes conversation for user
  const {id} = req.params;
  if(!id){
    res.status(404).json({message: "Conversation not found"});
    return;
  }
  const chat = await prisma.chat.delete({
    where: {
      id,
    },
  });
  res.json(chat);
};

exports.getConversation = async (req, res) => {
  const { id } = req.params;
  if (!req.user) {
    res.status(404).json({message: "User not found"});
    return;
  }
  if(!id){
    res.status(404).json({message: "Conversation not found"});
    return;
  }
  const messages = await prisma.message.findMany({
    where: {
      chat_id: id,
    },
    orderBy: {
      sent_at: "asc",
    },
    include: {
      sender: true,
      recipient: true,
    },
  });
  res.json(messages);
};

exports.getAllConversations = async (req, res) => {
  const id = req.user.id;
  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          id,
        },
      },
    },
    include: {
      users: {
        where: {
          id: {
            not: id,
          },
        },
      },
      message: {
        orderBy: {
          sent_at: "desc",
        },
        select: {
          body: true,
        },
        take: 1,
      },
    },
  });
  res.json(chats);
};

exports.sendMessage = async (req, res) => {
  const { id } = req.params; //chat id
  const { message, recipient } = req.body;
  const senderId = req.user.id;

  console.log(id, message, recipient, senderId);
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
          id: recipient,
        },
      },
      chat: {
        connect: {
          id,
        },
      },
    },
  });

  res.json(prismaMessage);
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
