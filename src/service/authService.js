require("dotenv").config();
import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { getGroupWithRoles } from "./JWTService";
import { createJWT } from "../middleware/JWTAction";
const salt = bcrypt.genSaltSync(10);

const authService = {};

export const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

export const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: { email: userEmail },
  });

  if (user) {
    return true;
  }
  return false;
};

export const checkPhoneExist = async (userPhone) => {
  let user = await db.User.findOne({
    where: { phone: userPhone },
  });

  if (user) {
    return true;
  }
  return false;
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword); // true or false
};

authService.register = async (rawUserData) => {
  try {
    //check email/phonenumber are exist
    let isEmailExist = await checkEmailExist(rawUserData.email);
    if (isEmailExist === true) {
      return {
        EM: "The email is already exist",
        EC: 1,
      };
    }
    let isPhoneExist = await checkPhoneExist(rawUserData.phone);
    if (isPhoneExist === true) {
      return {
        EM: "The phone number is already exist",
        EC: 1,
      };
    }
    //hash user password
    let hashPassword = hashUserPassword(rawUserData.password);

    //create new user
    await db.User.create({
      email: rawUserData.email,
      username: rawUserData.username,
      password: hashPassword,
      phone: rawUserData.phone,
      groupId: 1, //update
      group_id: 1, //update
    });

    return {
      EM: "A user is created successfully!",
      EC: "0",
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "Somthing wrongs in service...",
      EC: -2,
    };
  }
};

authService.login = async (rawData) => {
  try {
    let user = await db.User.findOne({
      where: {
        [Op.or]: [{ email: rawData.valueLogin }, { phone: rawData.valueLogin }],
      },
    });

    if (user) {
      let isCorrectPassword = checkPassword(rawData.password, user.password);
      if (isCorrectPassword === true) {
        let groupWithRoles = await getGroupWithRoles(user);

        let payload = {
          email: user.email,
          groupWithRoles,
          username: user.username,
        };
        let token = createJWT(payload);
        return {
          EM: "ok!",
          EC: 0,
          DT: {
            access_token: token,
            groupWithRoles,
            email: user.email,
            username: user.username,
          },
        };
      }
    }

    return {
      EM: "Your email/phone number or password is incorrect!",
      EC: 1,
      DT: "",
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Somthing wrongs in service...",
      EC: -2,
    };
  }
};

export default authService;
