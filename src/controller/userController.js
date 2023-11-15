import userApiService from "../service/userApiService";
import db from "../models";

const getOneUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await db.User.findOne({ where: { id: userId } });
    if (user) {
      return res.status(200).json({
        EC: 0,
        EM: "ok",
        DT: user,
      });
    } else {
      return res.status(404).json({
        EC: -1,
        EM: "Not found user",
        DT: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const readFunc = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let data = await userApiService.getUserWithPagination(+page, +limit);
      return res.status(200).json({
        EM: data.EM, // error message
        EC: data.EC, //error code
        DT: data.DT, //data
      });
    } else {
      let data = await userApiService.getAllUser();
      return res.status(200).json({
        EM: data.EM, // error message
        EC: data.EC, //error code
        DT: data.DT, //data
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "", //date
    });
  }
};
const createFunc = async (req, res) => {
  try {
    //validate
    let data = await userApiService.createNewUser(req.body);
    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "", //date
    });
  }
};
const updateFunc = async (req, res) => {
  try {
    //validate
    let data = await userApiService.updateUser(req.body);
    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "", //date
    });
  }
};
const deleteFunc = async (req, res) => {
  try {
    let data = await userApiService.deleteUser(req.body.id);
    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "", //date
    });
  }
};

const getUserAccount = async (req, res) => {
  //cookies
  //console.log(req.user)
  return res.status(200).json({
    EM: "ok", // error message
    EC: 0, //error code
    DT: {
      access_token: req.token,
      groupWithRoles: req.user?.groupWithRoles,
      email: req.user?.email,
      username: req.user?.username,
    },
  });
};
module.exports = {
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
  getUserAccount,
  getOneUser,
};
