// declaring global variable to hold primary key value.
var _FundManagerId;

$(document).ready(function () {
    $('#FundManagerList').DataTable({
        "order": [[1, "asc"]]
    });

    $(document).on('click', '.subscribe-prompt', function () {
        _FundManagerId = $(this).attr('id');
        $.ajax({
            url: "/Admin/GetFundManagerDetails?FundManagerID=" + _FundManagerId,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('#myModal').remove(); // Remove existing modal

                if (parseFloat(data.Mindipositamount) <= parseFloat(data.Userwalletbalance)) {
                    var Modelhtml = `
                    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                      <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content shadow">
                          <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="myModalLabel">
                              <i class="fa fa-check-circle"></i> Confirm Subscription
                            </h5>
                            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="modal-body">
                            <p>Are you sure you want to <strong>subscribe</strong> to this Fund Manager / Copy Trader?</p>
                            <ul class="mb-0">
                              <li><strong>Minimum Wallet Balance:</strong> ${parseFloat(data.Mindipositamount).toFixed(2)} USD</li>
                              <li><strong>Subscription Fee:</strong> ${parseFloat(data.Subscriptionfee).toFixed(2)} USD</li>
                            </ul>
                          </div>
                          <div class="modal-footer">
                            <button class="btn btn-success" onclick="subscribe()">Yes, Subscribe</button>
                            <button class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
                          </div>
                        </div>
                      </div>
                    </div>`;
                    $("#mainWindow").append(Modelhtml);
                    $('#myModal').modal('show');
                } else {
                    toastr.error('Not Sufficient Balance');
                }
            }
        });
        return false;
    });

    $(document).on('click', '.unsubscribe-prompt', function () {
        _FundManagerId = $(this).attr('id');
        $.ajax({
            url: "/Admin/GetFundManagerDetails?FundManagerID=" + _FundManagerId,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('#myModal').remove(); // Remove existing modal

                var headerClass = "bg-warning text-dark";
                var icon = `<i class="fa fa-question-circle"></i>`;
                var bodyMessage = `
                    <p>Are you sure you want to <strong>unsubscribe</strong> from this Fund Manager / Copy Trader?</p>`;
                if (parseInt(data.Totalsubscribeddays) < parseInt(data.TradingPeriod)) {
                    headerClass = "bg-danger text-white";
                    icon = `<i class="fa fa-exclamation-triangle"></i>`;
                    bodyMessage = `
                    <p>Are you sure you want to <strong>unsubscribe</strong> from this Fund Manager / Copy Trader?</p>
                    <ul class="mb-0">
                      <li><strong>Penalty Fee:</strong> ${parseFloat(data.Penaltyfee).toFixed(2)} USD</li>
                    </ul>`;
                }

                var Modelhtml = `
                <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                  <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content shadow">
                      <div class="modal-header ${headerClass}">
                        <h5 class="modal-title" id="myModalLabel">${icon} Confirm Unsubscription</h5>
                        <button type="button" class="close ${headerClass.includes('text-white') ? 'text-white' : 'text-dark'}" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        ${bodyMessage}
                      </div>
                      <div class="modal-footer">
                        <button class="btn btn-danger" onclick="Unsubscribe()">Yes, Unsubscribe</button>
                        <button class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>`;
                $("#mainWindow").append(Modelhtml);
                $('#myModal').modal('show');
            }
        });
        return false;
    });
});

function subscribe() {
    if (_FundManagerId != '') {
        window.location.href = "/Admin/Subscribe?ManagerId=" + _FundManagerId;
    }
}

function Unsubscribe() {
    if (_FundManagerId != '') {
        window.location.href = "/Admin/UnSubscribe?ManagerId=" + _FundManagerId;
    }
}
