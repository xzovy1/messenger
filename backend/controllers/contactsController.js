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
exports.getAllContacts = async (req, res) => {
  const { id } = req.app.user;
  if (!id) {
    res.status(404).json({ message: "User not found" });
  }
  const contacts = await getContacts(id);
  res.json(contacts);
};
