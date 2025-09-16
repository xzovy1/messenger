const prisma = require("../prisma/client.js");

exports.getUser = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id,
        },
        include: {
            profile: true,
        },
    });
}

exports.newUser = async (user) => {
    const { username, password, firstname, lastname, dob, bio, image } = user
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
}
