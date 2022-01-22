const User = require("../models/User");

exports.getAbout = (req, res, next) => {
  res.render("about", {
    path: "/about",
  });
};

exports.getAddNotes = (req, res, next) => {
  res.render("notes/edit-notes", {
    path: "/add-notes",
    edit: false,
  });
};

exports.postAddNotes = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;

  User.findById(req.session.user._id)
    .then((user) => {
      let notes = [];
      if (user.notes) {
        notes = user.notes;
      }
      notes.push({
        title: title,
        description: description,
      });
      user.notes = notes;
      return user.save();
    })
    .then((result) => {
      res.redirect("mynotes");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMyNotes = (req, res, next) => {
  User.findById(req.session.user._id)
    .then((user) => {
      let notes = [];
      if (user.notes) notes = user.notes;

      res.render("notes/mynotes", {
        path: "/mynotes",
        notes: notes,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditNotes = (req, res, next) => {
  const edit = req.query.edit;
  const noteId = req.params.noteId;

  User.findById(req.session.user._id).then((user) => {
    let note = user.notes.filter(
      (note) => note.id.toString() === noteId.toString()
    );
    console.log(edit, note[0]);
    res.render("notes/edit-notes", {
      path: "/add-notes",
      edit: edit,
      note: note[0],
    });
  });
};

exports.postEditNotes = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  User.findById(req.session.user._id)
    .then((user) => {
      for (let i = 0; i < user.notes.length; i++) {
        if (user.notes[i]._id.toString() === req.body.noteId.toString()) {
          user.notes[i].title = title;
          user.notes[i].description = description;
          break;
        }
      }
      user.save();
      return res.redirect("/mynotes");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteNote = (req, res, next) => {
  const noteId = req.body.noteId;
  console.log(noteId);
  User.findById(req.session.user._id)
    .then((user) => {
      let noteIndex  =-1;
      let notes = user.notes;
      for (let i = 0; i < user.notes.length; i++) {
        if (user.notes[i]._id.toString() === req.body.noteId.toString()) {
          noteIndex = i;
        }
      }
      if (noteIndex!=-1) {
          notes.splice(noteIndex,1);
        user.notes = notes;
        user.save();
      }

      return res.redirect("/mynotes");
    })
    .catch((err) => {
      console.log(err);
    });
};
