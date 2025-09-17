const prisma = require("../prisma/client.js");

exports.getContacts = async (id) => {
  return await prisma.user.findMany({
    where: {
      NOT: {
        id,
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
};
