var table;
function onload_Alerts() {
  $.get("/ip", (url) => {
    table = $("#datatable-table").dataTable({
          order: [],
      sDom: "<'row'<'col-md-6 hidden-xs'l><'col-md-6'f>r>t<'row'<'col-md-6'i><'col-md-6'p>>",
      oLanguage: {
        sLengthMenu: "_MENU_",
        sInfo: "Showing <strong>_START_ to _END_</strong> of _TOTAL_ entries",
      },
      oClasses: {
        sFilter: "pull-right",
        sFilterInput: "form-control input-transparent",
      },
      processing: true,
      serverSide: true,
      paging: true,
      pageLength: 10,

      ajax: {
        type: "POST",
        url: url + "/get_help_desk_alerts/banking/gumbir@gmail.com/P1",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: function (data) {
          // Grab form values containing user options
          // var form = {};
          // $.each($("form").serializeArray(), function (i, field) {
          //     form[field.name] = field.value || "";
          // });
          // // Add options used by Datatables
          // // var info = { "start": 0, "length": 10, "draw": 1 };
          // var info = (table == null) ? { "start": 0, "length": 10 } : table.page.info();
          // $.extend(form, info);
          return JSON.stringify(data);
        },
        complete: function (response) {
          // console.log(response);
        },
      },
      columns: [
        { title: "Alert Name", data: "alert_1" },
        { title: "Alert Location", data: "location" },
        { title: "Time", data: "date" },
        { title: "Assigned", data: "assigned_to" },
        { title: "Status", data: "alert_status" },
        { title: "Action", data: null, defaultContent: "" },
      ],
      columnDefs: [
        {
          targets: -1,
          createdCell: function (td, cellData, rowData, row, col) {
            $(td).prepend(
              `<button style="float:right;margin-top:15px;margin-bottom:10px;background-color:#315a83;border-color:#315a83";class="btn btn-primary btn-sm">View</button>`
            );
          },
        },
      ],
    });
  });
}

console.log($("#datatable-table tbody"));

const view = () => {
  $("#datatable-table tbody td").on("click", "button", function () {
    var data = table.row($(this).parents("tr")).data();
    alert(data.alert_1);
    data = null;
  });
};
