/*global require, $, _, psData*/
import $ from 'jquery';
import _ from 'underscore';
import Promise from 'bluebird';

export default function() {
  var studentRows = $('.studentrow');
  var ids = $.map(studentRows, row => $(row).attr('id').slice(5));

  fetch('/ws/schema/query/org.irondistrict.iep.queries.attendance_alert', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cc_ids: ids.join(',')
      })
    })
    .then(response => response.json())
    .then(results => {
      if (typeof results.record !== 'undefined') {
        results.record.forEach(alert => {
          var alertTemplate = $('#alert-template').html();
          var compiledTemplate = _.template(alertTemplate);
          var select = studentRows.filter(`[id$=${alert.cc_id}]`).find('td').eq(1);
          select.append(compiledTemplate({
            studentfrn: '001' + alert.studentsdcid
          }));
        });
      }
    });
}
