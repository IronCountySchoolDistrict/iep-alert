/* global psData, require */
require(["underscore", "jquery"], function(_, $) {
    if (psData === undefined) {
        var psData = {};
    }
    psData.studentdcid = "~(studentfrn)".slice(3);

    $.getJSON('/ws/schema/table/U_SPED_STUDENTS/' + psData.studentdcid + '?projection=*', function (alertResp) {
        var alert = alertResp.tables.u_sped_students;
        var template = $('#alert-content-template').html();
        var select = $('#psDialog');
        alert.additional_adaptions = alert.additional_adaptions.replace(/\n/g, "<br>");
        var renderedTemplate = _.template(template, {alert: alert});
        select.html(renderedTemplate);

        // When the dialog is first rendered, there isn't any content in it, so the centering is based on
        // the empty dialog box. When content is put into it, it doesn't automatically recenter itself,
        // so calling this function will recenter the dialog box.
        $('#psDialog').dialog('option', 'position', 'center');
    });
});