import express from "express";
import homeController from "../controller/homeController";
import authController from "../controller/authController";

const router = express.Router();

const initWebRoutes = (app) => {
  //path, handler
  router.get("/", homeController.handleHelloWord);
  router.get("/user", homeController.handleUserPage);
  router.post("/users/create-user", homeController.handleCreateNewUser);
  router.post("/delete-user/:id", homeController.handleDelteUser);
  router.get("/update-user/:id", homeController.getUpdateUserPage);
  router.post("/user/update-user", homeController.handleUpdateUser);

  //rest api
  //GET - R, POST- C, PUT - U, DELETE - D
  router.get("/api/test-api", authController.testApi);

  return app.use("/", router);
};

export default initWebRoutes;
