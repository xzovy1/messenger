const prisma = require("../prisma/client.js");

exports.getUser = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
      password: true, // tests fail if omitted
    },
  });
};

exports.usernameTaken = async (username) => {
  let taken = false;
  const users = await prisma.user.findMany({
    where: {
      username: username,
    },
  });
  if (users.length > 0) {
    taken = true;
  }
  return taken;
};

exports.getUserPassword = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      password: true,
    },
  });
  const password = user.password.hash;
  return password;
};

exports.newUser = async (user) => {
  const { username, password, firstname, lastname, dob, bio, image } = user;
  return await prisma.user.create({
    data: {
      username,
      password: {
        create: {
          hash: password,
        },
      },
      profile: {
        create: {
          firstname,
          lastname,
          dob: new Date(dob), //convert from "YYYY-MM-DD" to time
          bio,
          image: image,
        },
      },
    },
  });
};

exports.updateUser = async (user) => {
  const { username, password, id } = user;
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      username,
      password: {
        update: {
          hash: password,
        },
      },
    },
  });
};

exports.updateProfileImage = async (path, id) => {
  return await prisma.profile.update({
    where: {
      user_id: id,
    },
    data: {
      image: path,
    },
  });
};

exports.updateProfile = async (user, id) => {
  const { firstname, lastname, dob, bio, image } = user;

  return await prisma.profile.update({
    where: {
      user_id: id,
    },
    data: {
      dob: new Date(dob),
      firstname,
      lastname,
      bio,
    },
  });
};
