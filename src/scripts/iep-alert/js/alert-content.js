/* global psData, require, getPortal */
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
        'student_dcid': psData.studentdcid
      })
    })
    .then(response => response.json())
    .then(alertResp => {
      if (typeof alertResp.record !== 'undefined' && alertResp.record.length > 0) {
        var alert = alertResp.record[0];

        var template = $('#alert-content-template').html();
        var select = $('#psDialog');
        if (typeof alert.additional_adaptations !== 'undefined' && alert.additional_adaptations) {
          alert.additional_adaptations = alert.additional_adaptations.replace(/\r\n/g, '<br>');
        }
        var compiledTemplate = _.template(template);
        select.html(compiledTemplate({
          alert: alert
        }));

        // When the dialog is first rendered, there isn't any content in it, so the centering is based on
        // the empty dialog box. When content is put into it, it doesn't automatically recenter itself,
        // so calling this function will recenter the dialog box.
        $('#psDialog').dialog('option', 'position', 'center');
      }
    });
}
