const User = require("../models/user.model");
const Mail = require("../models/mail.model");

const mailCtrl = {};

mailCtrl.send = async function (req, res) {
  const newMail = Mail(req.body);

  try {
    let mail = await newMail.save();
    if (mail) {
      await User.updateOne(
        { username: req.body.sender },
        { $push: { sent: [mail._id] } }
      );

      await User.updateOne(
        { username: req.body.recipient },
        { $push: { inbox: [mail._id] } }
      );

      res.status(200).json({ sucess: true, message: "mail sent with success" });
      return;
    }

    throw new Error("could not send mail");
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

mailCtrl.deliver = function (req, res) {
  const actionTypes = {
    INBOX: "inbox",
    SENTBOX: "sent"
  };

  const { username, type } = req.body;

  try {
    User.findOne({ username })
      .populate(type)
      .exec(function (err, mls) {
        let data;

        switch (type) {
          case actionTypes.INBOX:
            data = mls.inbox;
            break;
          case actionTypes.SENTBOX:
            data = mls.sent;
            break;
          default:
            data = "invalid mailbox type";
        }

        if (err) {
          res.status(500).json({ success: false, message: err });
        } else {
          res.status(200).json({ success: true, data, type });
        }
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

mailCtrl.sync = async function (req, res) {
  const { state, id } = req.body;

  try {
    await Mail.findOneAndUpdate({ _id: id }, { $set: { read: state } });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = mailCtrl;
