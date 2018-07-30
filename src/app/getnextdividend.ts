import express from "express";
const getnextdividend_router = express.Router();

getnextdividend_router.get("/getnextdividend/:symbol", (req, res) => {
    res.send(req.params.symbol)
});

export { getnextdividend_router };
