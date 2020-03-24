var Promise = require('bluebird');

module.exports = {
  getStudentsBySectionId: function(sectionId) {
    return Section.findOne({id: sectionId}).populate('students').then(function (section) {
      return section.students;
    });
  },
  getStudentsByCourseId: function(courseId){
    console.log("In students");
    var all_students = [];
    var me = this;
    return Section.find({course: courseId}).then(function(sections){
      return Promise.each(sections, function(section){
        return me.getStudentsBySectionId(section.id).then(function(students){
          all_students.push(students);
          return;
        });
      }).then(function(){
        console.log(all_students);
        return [].concat.apply([], all_students);
      });
    });
  }
};
