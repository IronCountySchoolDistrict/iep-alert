/*global require, $, _, psData*/

require(['underscore', 'jquery'], function (_, $) {
        'use strict';
        if (psData === undefined) {
            var psData = {};
        }
        psData.studentdcid = "~(studentfrn)".slice(3);
        $.getJSON('/ws/schema/table/U_SPED_STUDENTS/' + psData.studentdcid + '?projection=*', function (alertResp) {
            var alert = alertResp.tables['u_sped_students'];
            var alertTemplate = $('#alert-template').html();
            var renderedTemplate = _.template(alertTemplate, {});
            var pageHeader = $('h1');
            var alerts = pageHeader.find('.dialogM');
            // If there are alerts already displayed
            var select;
            if ( !($.isEmptyObject(alerts[0])) ) {
                select = alerts.last();
                $(renderedTemplate).insertAfter(select);
            } else {
                select = pageHeader.contents().eq(0);
                $(renderedTemplate).insertAfter(select);
            }

            if (alert.caseload) {
                $('#alert-img').css({'display': 'inline'});
            }

            // TODO: Refactor this so this code doesn't have to run again after the alert is added.
            alerts = pageHeader.find('.dialogM');

            // Find the span element that contains elements with class .dialogM (alerts),
            // and remove "float: right" css rule from that span.
            // Note that not all pages with alerts place alerts in a span tag.
            var spanAlerts = pageHeader.find('span .dialogM');
            if ( !($.isEmptyObject(spanAlerts)[0]) ) {
                var alertSpan = spanAlerts.eq(0).parent();
                if (alertSpan.css('float') == 'right') {
                    alertSpan.css('float', 'none');
                }
            }

            $.each(alerts, function(index, elem) {
                $(elem).css({'visibility': 'visible'});
            });

            $('#student-service-alert').on('click', function(event) {
                var template = $('#alert-balance~(studentfrn)').html();
                var renderedTemplate = _.template(template, {});
                $('#psDialog').html(renderedTemplate);
            });
        });
    });