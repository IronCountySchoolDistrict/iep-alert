/*global require, $, _, psData*/
'use strict';
import $ from 'jquery';
import _ from 'underscore';
import * as Promise from 'bluebird';

export var fetchAlert = function() {
  var studentRows = $('.studentrow');
  var ids = $.map(studentRows, function(row) {
    return $(row).attr('id').slice(5);
  });
  var promises = $.map(ids, function(id) {
    return fetch(`/teachers/alerts/cc-alert.json.html?ccid=${id}`, {
      credentials: 'include'
    }).then(r => {
      return r.json()
    });
  });
  Promise.all(promises).then(function(results) {
    results.forEach(function(alert, index) {
      var alertTemplate = $('#alert-template').html();
      var renderedTemplate = _.template(alertTemplate, {
        studentfrn: '001' + alert.studentsdcid
      });
      if (alert.caseload) {
        var alertsTd = $(studentRows[index]).find('td').eq(1);
        console.log(renderedTemplate);
        alertsTd.append(renderedTemplate);
      }
    });
  });
};
