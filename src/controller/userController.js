import userApiService from "../service/userApiService";
import db from "../models";
import { Op } from "sequelize";

const NodeCache = require("node-cache");
const cache = new NodeCache();

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

//query trên trang trên trang hiện tại không ảnh hưởng toàn bộ danh sách
const getUserQueriesV2 = async (req, res) => {
  try {
    let {
      page,
      pageSize,
      sortBy,
      sortOrder,
      filterField,
      filterValue,
      role,
      search,
    } = req.query;

    page = +page || 1;
    pageSize = +pageSize || 5;
    sortBy = sortBy || "createdAt";
    sortOrder = sortOrder || "desc";
    filterField = filterField || null;
    filterValue = filterValue || null;
    role = +role || null;

    //Handle paginate
    const offset = (+page - 1) * +pageSize;
    const limit = +pageSize || 5;

    //handle get data
    const data = await db.User.findAndCountAll({
      attributes: ["id", "username", "email", "phone", "gender", "createdAt"],
      include: { model: db.Role, attributes: ["id", "name", "description"] },
      order: [[sortBy, sortOrder]],
      offset,
      limit,
    });

    //console.log(JSON.stringify(data, null, 2));

    let totalPages = Math.ceil(data.count / limit);

    // Xử lý bộ lọc chỉ trên trang hiện tại
    if (filterField && filterValue) {
      data.rows = data.rows.filter((item) =>
        item[filterField].toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (role) {
      data.rows = data.rows.filter((item) => item?.Role?.id === role);
    }

    if (search) {
      data.rows = data.rows.filter(
        (item) =>
          item.username.trim().toLowerCase() === search.trim().toLowerCase()
      );
    }

    // Thực hiện truy vấn chỉ lấy một phần nhỏ của dữ liệu
    // let data;
    // if (filterField && filterValue) {
    //   data = await db.User.findAndCountAll({
    //     where: {
    //       [filterField]: {
    //         [Op.like]: `%${filterValue}%`,
    //       },
    //     },
    //     order: [[sortBy, sortOrder]],
    //     offset,
    //     limit,
    //   });
    // } else {
    //   data = await db.User.findAndCountAll({
    //     order: [[sortBy, sortOrder]],
    //     offset,
    //     limit,
    //   });
    // }

    res.status(200).json({
      paginate: {
        count: data.count,
        page: page,
        limit: limit,
        totalPages: totalPages,
      },

      data: data.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed",
      status: 1,
    });
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
      role,
    } = req.query;

    page = +page || 1;
    pageSize = +pageSize || 5;
    sortBy = sortBy || "createdAt";
    sortOrder = sortOrder || "desc";
    filterBy = filterBy || null;
    filterValue = filterValue || null;
    gender = gender || null;
    search = search || null;
    role = role || null;

    const whereClause = {};
    const offset = (page - 1) * pageSize;

    if (role) {
      whereClause.roleId = +role;
    }

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

    let users = await db.User.findAndCountAll({
      attributes: ["id", "username", "email", "phone", "gender", "createdAt"],
      include: { model: db.Role, attributes: ["name", "description"] },
      order: [[sortBy, sortOrder.toUpperCase()]],
      where: whereClause,
      offset,
      limit: pageSize,
    });

    if (users.rows.length > 0) {
      return res.status(200).json({
        message: "Get success",
        status: 0,
        data: users.rows,
        paginate: {
          total: users.count,
          limit: pageSize,
          page: page,
        },
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
  getUserQueriesV2,
};
