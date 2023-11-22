import userApiService from "../service/userApiService";
import db from "../models";
import { Op } from "sequelize";

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

const getUserQueries = async (req, res) => {
  try {
    let {
      page,
      pageSize,
      sortBy,
      sortOrder,
      filterBy,
      filterValue,
      search,
      gender,
    } = req.query;

    page = parseInt(page) || 1; //currentPage
    pageSize = parseInt(pageSize) || 5; // limit
    sortBy = sortBy || "createdAt"; // Default to sorting by createdAt
    sortOrder = sortOrder || "desc"; // Default to descending order

    filterBy = filterBy || null; //field
    filterValue = filterValue || null; //valuefield

    gender = gender || null;

    search = search || null;

    const whereClause = {};
    const offset = (page - 1) * pageSize;

    if (gender) {
      whereClause.gender = gender;
    }

    if (filterBy && filterValue) {
      whereClause[filterBy] = filterValue;
    }

    if (search) {
      whereClause.username = {
        [Op.like]: `%${search}%`,
      };
    }

    let users = await db.User.findAll({
      attributes: ["id", "username", "email", "phone", "gender", "createdAt"],
      order: [[sortBy, sortOrder.toUpperCase()]],
      where: whereClause,
      include: { model: db.Role, attributes: ["name", "description"] },
      offset,
      limit: pageSize,
    });

    if (users) {
      return res.status(200).json({
        message: "Get success",
        status: 0,
        data: users,
      });
    } else {
      return res.status(500).json({
        message: "Failed",
        status: 1,
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
  getUserQueries,
};
