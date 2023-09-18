import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
  res.render("index", {
    subject: "EJS template engine",
    name: "our template",
    link: "https://google.com"
  })
})

router.get("/page", (req, res) => {
  res.render("page", {
    subject: "EJS template engine",
    name: "our template",
    link: "https://google.com"
  })
})

export default router