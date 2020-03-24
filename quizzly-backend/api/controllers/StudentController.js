/**
 * StudentController
 *
 * @description :: Server-side logic for managing Students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');

module.exports = {
  getStudentCourses: function(req, res) {
    sails.log.debug("--------------getStudentCourses");
    var data = req.params.all();
    var courses = [];
    Student.findOne({id: data.id}).populate('sections')
    .exec(function(err, student) {
      sails.log.debug("execing with student", student.firstName);
      sails.log.debug("student sections", student.sections);
      Promise.each(student.sections, function(section){
        sails.log.debug("in promise loop with section...", section);
        return Section.findOne({id: section.id}).then(function(section){
          sails.log.debug("section", section.title);
          return section;
        }).then(function(section) {
          sails.log.debug("SECTION", section.id)
          return Course.findOne({id: section.course}).then(function(course){
            if (course !== undefined){
              sails.log.debug("course", course.title);
              courses.push(course);
            }
          });
        });
      })
      .then(function() {
        sails.log.debug("finished!", courses.length);
        sails.log.debug("finished!", courses);
        sails.log.debug("result: " + res.json(courses));
        return res.json(courses);
      });
    });
  },

  getStudentSectionCourses: function(req, res) {
    sails.log.debug("--------------getStudentSectionCourses");
    var data = req.params.all();
    var sections = [];
    Student.findOne({id: data.id}).populate('sections')
    .exec(function(err, student) {
      sails.log.debug("execing with student", student.firstName);
      sails.log.debug("student sections", student.sections);
      Promise.each(student.sections, function(section){
        sails.log.debug("in promise loop with section...", section);
        return Section.findOne({id: section.id}).then(function(section){
          sails.log.debug("section", section.title);
          if (section !== undefined) {
            sections.push(section);
          }
        });
      })
      .then(function() {
        sails.log.debug("finished!", sections.length);
        sails.log.debug("finished!", sections);
        sails.log.debug("result: " + res.json(sections));
        return res.json(sections);
      });
    });
  },

  getStudentCoursesByEmail: function(req, res) {
    var data = req.params.all();
    var courses = [];
    Student.findOne({email: data.user}).populate('sections')
    .exec(function(err, student) {
      sails.log.debug("execing with student", student.firstName);
      sails.log.debug("student sections", student.sections);
      Promise.each(student.sections, function(section){
        sails.log.debug("in promise loop with section...", section);
        return Section.findOne({id: section.id}).then(function(section){
          sails.log.debug("section", section.title);
          return section;
        }).then(function(section) {
          return Course.findOne({id: section.course}).then(function(course){
            sails.log.debug("course", course.title);
            courses.push(course);
          });
        });
      })
      .then(function() {
        sails.log.debug("finished!", courses.length);
        sails.log.debug("finished!", courses);
        return res.json(courses);
      });
    });
  },

  getStudentsByCourseId: function(req,res) {
    sails.log.debug("--------------getStudentsByCourseId");
    var data = req.params.all();
    var students = [];
    // var allStudents= Students.find().populate('sections');
    Section.find({course: data.id}).exec(function (err, sections) {
      // sails.log.debug("sections", sections);
      Promise.each(sections,function(section) {
        // sails.log.debug("section",section);
        return Student.find().populate('sections').then(function (all_students) {
          // sails.log.debug("all_students", all_students);
          return all_students;
        }).then(function(all_students) {
          // sails.log.debug("all_students_length", all_students.length);
          return Promise.each(all_students, function(student){
            // sails.log.debug("all_students_length", student.sections.length);
            for (var i = 0; i < student.sections.length; i++) {
              // sails.log.debug("section.id",section.id);
              // sails.log.debug("student.sections[i]",student.sections[i]);
              if (student.sections[i].id == section.id) {
                // sails.log.debug("YOLO");
                students.push(student);
                return;
              }
            }
          });
        });
      }).then(function() {
        sails.log.debug("finished!", students.length);
        // sails.log.debug("finished!", students);
        return res.json(students);
      });
    });
  },

  getStudentsBySectionId: function(req,res) {
    sails.log.debug("--------------getStudentsBySectionId");
    var data = req.params.all();
    console.log(data.id);
    StudentService.getStudentsBySectionId(data.id).then(function(students) {
        sails.log.debug("finished!", students.length);
        // sails.log.debug("finished!", students);
        return res.json(students);
      });
  },
  getStudentIdsFromEmails: function(req, res) {
    var data = req.params.all();
    var studentIds = [];

    Promise.each(data.studentEmails, function(studentEmail){
      return Student.findOne({email: studentEmail})
      .then(function(student) {
        if(student != undefined) {
          studentIds.push(student.id);
        }
      });
    })
    .then(function() {
      return res.json(studentIds);
    });
  },
  findinorder: function(req, res) {
    Student.find().sort('createdAt DESC').exec(function (err, students) {
      return res.json(students);
    });
  }
  // getStudentAnswer: function(req,res) {
  //   sails.log.debug("--------------getStudentAnswer");
  //   var data = req.params.all();
  //   var courses = [];
  // }
};
