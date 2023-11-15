import authService from "../service/authService";

const authController = {};

authController.testApi = (req, res) => {
  return res.status(200).json({
    message: "ok",
    data: "test api",
  });
};

authController.registerController = async (req, res) => {
  try {
    //req.body:  email, phone, username, password
    if (!req.body.email || !req.body.phone || !req.body.password) {
      return res.status(200).json({
        EM: "Missing required parameters", // error message
        EC: "1", //error code
        DT: "", //date
      });
    }
    if (req.body.password && req.body.password.length < 4) {
      return res.status(200).json({
        EM: "Your password must have more than 3 letters", // error message
        EC: "1", //error code
        DT: "", //date
      });
    }

    //service: create user
    let data = await authService.register(req.body);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC, //error code
      DT: "", //date
    });
  } catch (e) {
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", //error code
      DT: "", //date
    });
  }
};

authController.loginController = async (req, res) => {
  try {
    let data = await authService.login(req.body.data);
    //set cookie
    if (data && data.DT && data.DT.access_token) {
      res.cookie("jwt", data.DT.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
    }

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

authController.logoutController = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({
      EM: "clear cookies done!", // error message
      EC: 0, //error code
      DT: "", //data
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

export default authController;
