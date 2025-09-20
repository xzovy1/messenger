const prisma = require("../prisma/client.js");

exports.getUser = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
    },
    omit: {
      password_id: true,
    }
  });
};

exports.newUser = async (user) => {
  const { username, password, firstname, lastname, dob, bio, image } = user;
  return await prisma.user.create({
    data: {
      username,
      password: {
        create: {
          password,
        },
      },
      profile: {
        create: {
          firstname,
          lastname,
          dob: new Date(dob), //convert from "YYYY-MM-DD" to time
          bio,
          image: image || "backend/images/default_image.jpg",
        },
      },
    },
  });
};

exports.updateUser = async (user) => {
  const { username, password, id } = user;

  return await prisma.user.update({
    where: {
      id
    },
    data: user
  })
}

//multer??
exports.updateProfile = async (user) => {
  const { firstname, lastname, dob, bio, image, id, } = user;

  return await prisma.profile.update({
    where: {
      user_id: id
    },
    data: {
      dob: new Date(dob),
      firstname,
      lastname,
      bio,

    },
  })
}
