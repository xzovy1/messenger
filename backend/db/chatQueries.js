const prisma = require("../prisma/client.js");

exports.newConversation = async (sender, recipient) => {
    const conversation = await prisma.chat.create({
        data: {
            users: {
                connect: [{ id: sender }, { id: recipient }],
            },
        },
        include: {
            users: true,
        },
    });
    return conversation;
}

exports.deleteConversation = async (id) => {
    await prisma.chat.delete({
        where: {
            id,
        },
    });
}

exports.getConversation = async (id) => {
    return await prisma.message.findMany({
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
}
exports.markMessageRead = async(id) => {
    return await prisma.message.update({
        where: {
            id
        },
        data: {
            read: true
        }
    })
}

exports.getAllConversations = async (id) => {
    return await prisma.chat.findMany({
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
                    read: true,
                    recipient_id: true,
                },
                take: 1,
            },
        },
    });
}

exports.sendMessage = async (sender, recipient, body, chatId) => {
    return await prisma.message.create({
        data: {
            body,
            sender: {
                connect: {
                    id: sender,
                },
            },
            recipient: {
                connect: {
                    id: recipient,
                },
            },
            chat: {
                connect: {
                    id: chatId,
                },
            },
        },
    });
}