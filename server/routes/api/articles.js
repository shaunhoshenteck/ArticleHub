const express = require("express");
let router = express.Router();
require("dotenv").config();

const { Article } = require("../../models/article_model");
const { Category } = require("../../models/category_model");
const { checkLoggedIn } = require("../../middleware/auth");
const { grantAccess } = require("../../middleware/roles");
const { sortArgsHelper } = require("../../config/helpers");

// Add Single Article
router.post(
  "/admin/add_articles",
  checkLoggedIn,
  grantAccess("createAny", "article"),
  async (req, res) => {
    try {
      const article = new Article({
        ...req.body,
        score: parseInt(req.body.score),
      });
      const result = await article.save();
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: "Error adding article", error: err });
    }
  }
);

// Admin get, patch , delete, single article
router.get(
  "/admin/:id",
  checkLoggedIn,
  grantAccess("readAny", "article"),
  async (req, res) => {
    try {
      const _id = req.params.id;
      const article = await Article.findById(_id);

      if (!article || article.length === 0)
        return res.status(400).json({ message: "Article does not exist" });

      res.status(200).send(article);
    } catch (err) {
      res.status(400).json({ message: "Error fetching article", error: err });
    }
  }
);

router.patch(
  "/admin/:id",
  checkLoggedIn,
  grantAccess("updateAny", "article"),
  async (req, res) => {
    try {
      const article = await Article.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        { $set: req.body },
        { new: true, useFindAndModify: false }
      );

      if (!article)
        return res.status(400).json({ message: "Article does not exist" });
      res.status(200).send(article);
    } catch (err) {
      res.status(400).json({ message: "Error Updating article", error: err });
    }
  }
);

router.delete(
  "/admin/:id",
  checkLoggedIn,
  grantAccess("deleteAny", "article"),
  async (req, res) => {
    try {
      const article = await Article.findOneAndDelete({
        _id: req.params.id,
      });

      if (!article)
        return res.status(400).json({ message: "Article does not exist" });
      res.status(200).send("Article deleted successfully");
    } catch (err) {
      res.status(400).json({ message: "Error Deleting article", error: err });
    }
  }
);

// get articles no auth
router.get("/get_byid/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const article = await Article.find({ _id: _id, status: "public" }).populate(
      "category"
    );

    if (!article || article.length === 0) {
      return res.status(400).json({ message: "Article not found" });
    }
    res.status(200).send(article);
  } catch (err) {
    res.status(400).json({ message: "Error fetching article", error: err });
  }
});

// fetch articles load more
router.post("/loadmore", async (req, res) => {
  try {
    let sortArgs = sortArgsHelper(req.body);
    // console.log(sortArgs);
    const articles = await Article.find({ status: "public" })
      .populate("category")
      .sort([[sortArgs.sortBy, sortArgs.order]])
      .skip(sortArgs.skip)
      .limit(sortArgs.limit);
    res.status(200).json(articles);
  } catch (err) {
    res.status(400).json({ message: "Error fetching article", error: err });
  }
});

// fetch articles with paginaton
router.post(
  "/admin/paginate",
  checkLoggedIn,
  grantAccess("readAny", "articles"),
  async (req, res) => {
    try {
      //   let aggQuery = Article.aggregate([
      //     { $match: { status: "public" } },
      //     { $match: { title: { $regex: /lorem/ } } },
      //   ]);

      const limit = req.body.limit ? req.body.limit : 5;
      const aggQuery = Article.aggregate();
      const options = {
        page: req.body.page,
        limit,
        sort: { _id: "desc" },
      };
      const articles = await Article.aggregatePaginate(aggQuery, options);
      res.status(200).json(articles);
    } catch (err) {
      res.status(400).json({ message: "Error", err });
    }
  }
);

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json({ message: "Error getting categories" }, err);
  }
});

router.post(
  "/categories",
  checkLoggedIn,
  grantAccess("createAny", "categories"),
  async (req, res) => {
    try {
      const category = new Category(req.body);
      await category.save();

      res.status(200).json(category);
    } catch (err) {
      res.status(400).json({ message: "Error getting categories" }, err);
    }
  }
);

module.exports = router;
