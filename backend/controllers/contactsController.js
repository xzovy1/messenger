const prisma = require("../prisma/client.js");

exports.addToFavorite = async (req, res) => {
  const contact = await prisma.contacts.update({
    where: {},
  });
  res.json(contact);
};
exports.getAllFavorites = async (req, res) => {
  const contact = await prisma.user.findMany({
    where: {},
  });
  res.json(contact);
};
exports.getAllContacts = async (req, res) => {
  const contacts = await prisma.user.findMany({
    where: {
      NOT: {
        id: req.app.user.id,
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  res.json(contacts);
};
