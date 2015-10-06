/*global require, $, _, psData*/
'use strict';
import $ from 'jquery';
import _ from 'underscore';

export var fetchAlert = function() {
  var alertUrl;
  if (getPortal() === 'admin') {
    alertUrl = `/ws/schema/table/U_SPED_STUDENTS2/${psData.studentdcid}?projection=*`;
  } else {
    alertUrl = `/teachers/alerts/sped-alert.json.html?studentsdcid=${psData.studentdcid}`;
  }
  fetch(alertUrl, {
      credentials: 'include'
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(alertResp) {
      var alert;
      if (getPortal() === 'admin') {
        alert = alertResp.tables['u_sped_students2'];
      } else {
        alert = alertResp;
      }
      var alertTemplate = $('#alert-template').html();
      var renderedTemplate = _.template(alertTemplate, {});
      var pageHeader = $('h1');
      var alerts = pageHeader.find('.dialogM');
      // If there are alerts already displayed
      var select;
      if (!$.isEmptyObject(alerts[0])) {
        select = alerts.last();
        $(renderedTemplate).insertAfter(select);
      } else {
        select = pageHeader.contents().eq(0);
        $(renderedTemplate).insertAfter(select);
      }

      if (alert.caseload) {
        $('#alert-img').css({
          'display': 'inline'
        });
      }

      // TODO: Refactor this so this code doesn't have to run again after the alert is added.
      alerts = pageHeader.find('.dialogM');

      // Find the span element that contains elements with class .dialogM (alerts),
      // and remove "float: right" css rule from that span.
      // Note that not all pages with alerts place alerts in a span tag.
      var spanAlerts = pageHeader.find('span .dialogM');
      if (!$.isEmptyObject(spanAlerts)[0]) {
        var alertSpan = spanAlerts.eq(0).parent();
        if (alertSpan.css('float') == 'right') {
          alertSpan.css('float', 'none');
        }
      }

      $.each(alerts, function(index, elem) {
        $(elem).css({
          'visibility': 'visible'
        });
      });

      $('#student-service-alert').on('click', function(event) {
        var template = $('#alert-balance~(studentfrn)').html();
        var renderedTemplate = _.template(template, {});
        $('#psDialog').html(renderedTemplate);
      });
    })
    .catch(function(ex) {
      console.dir(ex);
      console.log('student alert not found');
    });
};
