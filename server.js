const express = require(express);
const app = express();

const fourOhFour = (req, res) => {
    res.status(404);
    res.render("pages/404", {
        title: "Nope!",
        path: req.originalUrl
    })
}

app.get("*", fourOhFour);

app.listen(8000);