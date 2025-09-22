const prisma = require("../prisma/client.js");
const { getContacts } = require("../db/contactQueries.js");

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
exports.getAllContacts = async (req, res, next) => {
  const { id } = req.user;
  if (!id) {
    next(new Error("User ID not found"));
  }
  const contacts = await getContacts(id);
  res.json(contacts);
};
