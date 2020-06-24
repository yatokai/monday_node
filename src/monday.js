var express = require("express");
var router = express.Router();
const axios = require("axios");
const mondaySdk = require("monday-sdk-js");
const {
  boardQuery,
  getItemDetailQuery,
  getUserDetailQuery,
  getUsersQuery,
} = require("./query");

const monday = mondaySdk();

router.get("/", async function (req, res, next) {
  console.log("coming token...");

  const code = req.query.code;
  const redirect_uri = req.query.redirect_uri;
  console.log("Code:", code);
  console.log("Redirect URI: ", redirect_uri);

  try {
    const response = await axios.post("https://auth.monday.com/oauth2/token", {
      code: code,
      client_id: "00f805498a060d4040a8bf7f851625fe",
      client_secret: "6675e5e68886aec6b389c626d3dbe6f5",
      redirect_uri: redirect_uri,
    });

    return res.send({
      token: response.data.access_token,
    });
  } catch (err) {
    res.status(500);
    return res.send(err);
  }
});

router.post("/board", async function (req, res, next) {
  console.log("coming board...");
  const token = req.body.token;

  try {
    monday.setToken(token);
    const boardResponse = await monday.api(boardQuery());
    const columns = boardResponse.data.boards[0].columns;

    let itemIds = "";
    for (item of boardResponse.data.boards[0].items) {
      itemIds += `${item.id}, `;
    }
    console.log("item ids: ", itemIds);

    const itemResponse = await monday.api(getItemDetailQuery(itemIds));
    const usersResponse = await monday.api(getUsersQuery());

    let items = [];
    const users = usersResponse.data.users;

    for (item of itemResponse.data.items) {
      const assets = item.assets;
      let newItem = {
        name: {
          text: item.name,
          value: item.name,
        },
      };

      for (column of item.column_values) {
        const value = JSON.parse(column.value);
        if (value && value.files && value.files[0].fileType === "ASSET") {
          for (asset of assets) {
            if (parseInt(asset.id, 10) === value.files[0].assetId) {
              newItem = {
                ...newItem,
                [column.id]: {
                  text: asset.public_url,
                  value,
                },
              };
            }
          }
        } else if (value && value.personsAndTeams) {
          let teams = [];
          for (person of value.personsAndTeams) {
            for (user of users) {
              if (person.id == user.id) teams.push(user);
            }
          }
          newItem = {
            ...newItem,
            [column.id]: {
              text: teams,
              value,
            },
          };
        } else {
          newItem = {
            ...newItem,
            [column.id]: {
              text: column.text,
              value,
            },
          };
        }
      }

      items.push(newItem);
    }

    res.status(200);
    return res.send({
      columns,
      items,
    });
  } catch (err) {
    console.log("----------------", err);
    res.status(500);
    return res.send(err);
  }
});

router.post("/person", async function (req, res, next) {
  console.log("coming person...");
  const ids = req.body.ids;
  try {
    const response = await monday.api(getUserDetailQuery(ids));
    res.status(200);
    return res.send(response.data.users);
  } catch (err) {
    console.log(err);
    res.status(500);
    return res.send(err);
  }
});

router.get("/test", function (req, res, next) {
  res.send(boardQuery());
});

module.exports = router;
