import db from "../models/index";
import {
  checkEmailExist,
  checkPhoneExist,
  hashUserPassword,
} from "./authService";

const getAllUser = async () => {
  try {
    let users = await db.User.findAll({
      attributes: ["id", "username", "email", "phone", "gender", "createdAt"],
      order: [["updatedAt", "DESC"]],
      include: { model: db.Role, attributes: ["name", "description"] },
    });
    if (users) {
      return {
        EM: "get data success",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "get data success",
        EC: 0,
        DT: [],
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with servies",
      EC: 1,
      DT: [],
    };
  }
};

const getUserWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit; //page

    const { count, rows } = await db.User.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: [
        "id",
        "username",
        "email",
        "phone",
        "gender",
        "address",
        "createdAt",
      ],
      include: { model: db.Role, attributes: ["name", "description", "id"] },
      order: [["id", "DESC"]],
    });

    let totalPages = Math.ceil(count / limit); //pageSize

    let data = {
      totalRows: count,
      totalPages: totalPages,
      users: rows,
    };

    return {
      EM: "Get users successful",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with servies",
      EC: 1,
      DT: [],
    };
  }
};

const createNewUser = async (data) => {
  try {
    // console.log(data);
    //check email, phone number
    let isEmailExist = await checkEmailExist(data.email);
    if (isEmailExist === true) {
      return {
        EM: "The email is already exist",
        EC: 1,
        DT: "email",
      };
    }
    let isPhoneExist = await checkPhoneExist(data.phone);
    if (isPhoneExist === true) {
      return {
        EM: "The phone number is already exist",
        EC: 1,
        DT: "phone",
      };
    }
    //hash user password
    let hashPassword = hashUserPassword(data.password);

    //hash user password
    await db.User.create({
      ...data,
      roleId: data.role_id, //add
      password: hashPassword,
    });

    return {
      EM: "create ok",
      EC: 0,
      DT: [],
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with servies",
      EC: 1,
      DT: [],
    };
  }
};

const updateUser = async (data) => {
  try {
    if (!data.role_id) {
      return {
        EM: "Error with empty roleId",
        EC: 1,
        DT: "group",
      };
    }

    let user = await db.User.findOne({
      where: { id: data.id },
    });

    if (user) {
      //update
      await user.update({
        username: data.username,
        address: data.address,
        gender: data.gender,
        phone: data.phone,
        roleId: data.role_id,
      });

      return {
        EM: "Update user succeeds",
        EC: 0,
        DT: "",
      };
    } else {
      //not found
      return {
        EM: "User not found",
        EC: 2,
        DT: "",
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with servies",
      EC: 1,
      DT: [],
    };
  }
};

const deleteUser = async (id) => {
  try {
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (user) {
      await user.destroy();
      return {
        EM: "Delete user succeeds",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "User not exist",
        EC: 2,
        DT: [],
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "error from service",
      EC: 1,
      DT: [],
    };
  }
};

module.exports = {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
  getUserWithPagination,
};
