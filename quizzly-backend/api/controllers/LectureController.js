/**
 * LectureController
 *
 * @description :: Server-side logic for managing Lectures
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var Promise = require('bluebird');

module.exports = {
  createLecture: function(req, res) {
    var data = req.params.all();
    var lecture = data;
    // sails.log("*** lecture", lecture);
    Lecture.create({
      title: lecture.title,
      professor: lecture.professor.id,
      course: lecture.course.id,
    })
    .then(function(newLecture) {
      // sails.log("newLecture", newLecture);
      var lectureItems = lecture.lectureItems;
      for(var i = 0; i < lectureItems.length; ++i) {
        var lectureItem = lectureItems[i];
        lectureItem.lecture = newLecture.id;
        switch (lectureItem.type) {
          case 'QUESTION':
            lectureItem.question = lectureItem.question.id;
          break;
          case 'QUIZ':
            lectureItem.quiz = lectureItem.quiz.id;
          break;
        }
      }
      return [LectureItem.create(lectureItems), newLecture];
      // return Promise.each(lecture.lectureItems, function(lectureItem) {
      //   // sails.log.debug("quiz: ", quiz);
      //   var newLectureItem = {
      //     type: lectureItem.type,
      //     lecture: newLecture.id
      //   };
      //   // sails.log("lectureItem", newLectureItem);
      //   switch (lectureItem.type) {
      //     case 'QUESTION':
      //       newLectureItem.question = lectureItem.question.id;
      //     break;
      //     case 'QUIZ':
      //       newLectureItem.quiz = lectureItem.quiz.id;
      //     break;
      //   }
      //   return LectureItem.create(newLectureItem);
      // });
    })
    .spread(function(lectureItems, newLecture) {
      return Lecture.find(newLecture)
      .populate('lectureItems');
    })
    .then(function(resLecture) {
      return res.json(resLecture);
    })
  },
  fullLectures: function(req, res) {
    var data = req.params.all();
    var courseId = null;
    var lectureSearchCriteria = null;
    if(data.course) {
      courseId = data.course;
      lectureSearchCriteria = {course: courseId};
    }
    if(data.professor) {
      professorId = data.professor;
      lectureSearchCriteria = {professor: professorId};
    }
    // sails.log(courseId);
    var fullLectureItems = [];
    if(!lectureSearchCriteria) {
      return res.json([]);
    }
    Lecture.find(lectureSearchCriteria)
    .populateAll()
    .then(function(lectures) {
      var lectureItemIds = [];
      for(var i = 0; i < lectures.length; ++i) {
        var lecture = lectures[i];
        for(var j = 0; j < lecture.lectureItems.length; ++j) {
          var lectureItem = lecture.lectureItems[j];
          lectureItemIds.push(lectureItem.id);
        }
      }

      var lectureItemsPromise = Promise.each(lectureItemIds, function(lectureItemId) {
        return LectureItem.findOne(lectureItemId)
        .populate('question')
        .populate('quiz')
        .then(function(lectureItem) {
          switch (lectureItem.type) {
            case 'QUESTION':
              return Question.findOne(lectureItem.question.id).populateAll()
              .then(function(question) {
                lectureItem.question = question;
                fullLectureItems.push(lectureItem);
              })
            break;
            case 'QUIZ':
              return Quiz.findOne(lectureItem.quiz.id).populateAll()
              .then(function(quiz) {
                var questions = [];
                return Promise.each(quiz.questions, function(question) {
                  return Question.findOne(question.id).populateAll()
                  .then(function(question) {
                    questions.push(question);
                  });
                })
                .then(function() {
                  console.log('questions', questions);
                  quiz.questions = questions;
                  lectureItem.quiz = quiz;
                  fullLectureItems.push(lectureItem);
                })
              })
            break;
          }
        })
      });

      return [lectures, lectureItemsPromise];
    })
    .spread(function(lectures, lectureItemsUnusable) {
      var lectureItems = fullLectureItems;
      for(var lectureIndex = 0; lectureIndex < lectures.length; ++lectureIndex) {
        var lecture = lectures[lectureIndex];
        lecture.lectureItems = [];
        for(var lectureItemIndex = 0; lectureItemIndex < lectureItems.length; ++lectureItemIndex) {
          var lectureItem = lectureItems[lectureItemIndex];

          if(lecture.id == lectureItem.lecture){
            lecture.lectureItems.push(lectureItem);
          }
        }
      }

      return res.json(lectures);
    });
  }
};
