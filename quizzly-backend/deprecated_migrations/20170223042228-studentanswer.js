'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable('studentanswer', {
    columns: {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      answer: 'string',
      text: 'string',
      student: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'studentanswer_student_fk',
          table: 'student',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      question: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'studentanswer_question_fk',
          table: 'question',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      quiz: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'studentanswer_quiz_fk',
          table: 'quiz',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      section: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'studentanswer_section_fk',
          table: 'section',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      course: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'studentanswer_course_fk',
          table: 'course',
          rules: {
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      createdAt: {type: 'date'},
      updatedAt: {type: 'date'}  // shorthand notation
    },
    ifNotExists: true
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('studentanswer', callback);
};

exports._meta = {
  "version": 1
};
