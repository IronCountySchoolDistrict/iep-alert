/*global require, $, _, psData*/
import $ from 'jquery';
import _ from 'underscore';

export default function() {
  fetch('/ws/schema/query/org.irondistrict.iep.queries.alert', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        student_dcid: psData.studentdcid
      })
    })
    .then(response => response.json())
    .then(alertResp => {
      if (typeof alertResp.record !== 'undefined' && alertResp.record.length > 0) {
        var alert = alertResp.record[0];
        var alertTemplate = $('#alert-template').html();
        var compiledTemplate = _.template(alertTemplate);
        var pageHeader = $('h1');
        var alerts = pageHeader.find('.dialogM');
        // If there are alerts already displayed
        var select;
        if (!$.isEmptyObject(alerts[0])) {
          select = alerts.last();
        } else {
          select = pageHeader.contents().eq(0);
        }
        $(compiledTemplate({})).insertAfter(select);


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
          var compiledTemplate = _.template(template);
          $('#psDialog').html(compiledTemplate({}));
        });
      }
    })
    .catch(function(ex) {
      console.dir(ex);
      console.log('student alert not found');
    });
}
