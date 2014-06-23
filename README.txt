1. In order to use page fragments on a page, you must have an insertion point. This plugin uses a page fragment on a
wildcard that doesn't include an insertion point on that page. To install this plugin, a custom insertion point
must be created. Open the file web_root/wildcards/title_student_end_css.txt
and add the following HTML code to the end of the first line:

<div class="cust-title-student">~[cust.insertion_point:content.alert]</div>

2. If you do not have the SAMS Profile For PowerTeacher plugin installed, you may ignore or delete the file
/web_root/teachers/studentpages/profile.iepalert.content.footer.txt.