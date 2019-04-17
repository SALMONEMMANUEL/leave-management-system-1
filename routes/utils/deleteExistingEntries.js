const Timetable = require('../../models/TestTimetable');

const deleteExistingEntries = classId => {
  return new Promise((resolve, reject) => {
    Timetable.deleteMany({
      class: classId
    })
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
};

module.exports = deleteExistingEntries;
